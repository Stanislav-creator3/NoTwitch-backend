import { ForbiddenException, Injectable } from '@nestjs/common'
import type { User } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { StripeService } from '../../libs/stripe/stripe.service'
import { CreatePlanInput } from './inputs/create-plan.input'

@Injectable()
export class PlanService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly stripeService: StripeService
	) {}

	public async findMyPlans(user: User) {
		const plans = await this.prismaService.sponsorshipPlan.findMany({
			where: {
				channelId: user.id
			}
		})

		return plans
	}

	public async createPlan(user: User, input: CreatePlanInput) {
		const { title, price, description } = input

		const channel = await this.prismaService.user.findUnique({
			where: {
				id: user.id
			}
		})

		if (!channel.isVerified) {
			throw new ForbiddenException(
				'Создание планов доступно только для верифицированных каналов'
			)
		}

		const stripePlan = await this.stripeService.plans.create({
			amount: Math.round(price * 100),
			currency: 'rub',
			interval: 'month',
			product: {
				name: title
			}
		})

		await this.prismaService.sponsorshipPlan.create({
			data: {
				title,
				description,
				price,
				stripePlanId: stripePlan.id,
				stripeProductId: stripePlan.product.toString(),
				channel: {
					connect: {
						id: user.id
					}
				}
			}
		})

		return true
	}

	public async removePlan(planId: string) {
		const plan = await this.prismaService.sponsorshipPlan.findUnique({
			where: {
				id: planId
			}
		})

		if (!plan) {
			throw new ForbiddenException('План не найден')
		}

		await this.stripeService.plans.del(plan.stripePlanId)
		await this.stripeService.products.del(plan.stripeProductId)

		await this.prismaService.sponsorshipPlan.delete({
			where: {
				id: plan.id
			}
		})

		return true
	}
}
