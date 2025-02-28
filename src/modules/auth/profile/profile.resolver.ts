import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js'
import * as Upload from 'graphql-upload/Upload.js'
import { User } from '@/prisma/generated'
import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'
import { FileValidationPipe } from '@/src/shared/pipes/file-validation.pipe'
import { ChangeProfileInput } from './inputs/change-profile-info.input'
import {
	SocialLinkInput,
	SocialLinkOrderInput
} from './inputs/social-link.input'
import { SocialLinkModel } from './models/social-link.module'
import { ProfileService } from './profile.service'

@Resolver('Profile')
export class ProfileResolver {
	constructor(private readonly profileService: ProfileService) {}

	@Authorization()
	@Mutation(() => Boolean, { name: 'changeAvatar' })
	public async changeAvatar(
		@Authorized() user: User,
		@Args('avatar', { type: () => GraphQLUpload }, FileValidationPipe)
		avatar: Upload
	) {
		return this.profileService.changeAvatar(user, avatar)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'removeAvatar' })
	public async removeAvatar(@Authorized() user: User) {
		return this.profileService.removeAvatar(user)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'changeInfo' })
	public async changeInfo(
		@Authorized() user: User,
		@Args('data') input: ChangeProfileInput
	) {
		return this.profileService.changeInfo(user, input)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'createSocialLink' })
	public async createSocialLink(
		@Authorized() user: User,
		@Args('data') input: SocialLinkInput
	) {
		return this.profileService.createSocialLink(user, input)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'reorderSocialLink' })
	public async reorderSocialLink(
		@Args('list', { type: () => [SocialLinkOrderInput] })
		list: SocialLinkOrderInput[]
	) {
		return this.profileService.reorderSocialLink(list)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'updateSocialLink' })
	public async updateSocialLink(
		@Authorized() user: User,
		@Args('id') id: string,
		@Args('data') input: SocialLinkInput
	) {
		return this.profileService.updateSocialLink(id, input)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'removeSocialLink' })
	public async removeSocialLink(@Args('id') id: string) {
		return this.profileService.removeSocialLink(id)
	}

	@Authorization()
	@Query(() => [SocialLinkModel], { name: 'findSocialLinks' })
	public async findSocialLink(@Authorized() user: User) {
		return this.profileService.findSocialLinks(user)
	}
}
