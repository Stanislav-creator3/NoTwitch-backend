import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { User } from '@/prisma/generated'
import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'
import { CreatePlanInput } from './inputs/create-plan.input'
import { PlanModel } from './models/plan.model'
import { PlanService } from './plan.service'

@Resolver('Plan')
export class PlanResolver {
	constructor(private readonly planService: PlanService) {}

	@Authorization()
	@Query(() => [PlanModel], { name: 'findMyPlans' })
	public async findMyPlans(@Authorized() user: User) {
		return this.planService.findMyPlans(user)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'createPlan' })
	public async createPlan(
		@Authorized() user: User,
		@Args('data') input: CreatePlanInput
	) {
		return this.planService.createPlan(user, input)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'removePlan' })
	public async removePlan(@Args('planId') planId: string) {
		return this.planService.removePlan(planId)
	}
}
