import { Field, ID, ObjectType } from '@nestjs/graphql'
import type { Stream } from '@/prisma/generated'
import { UserModel } from '../../auth/account/models/user.model'
import { CategoryModel } from '../../category/models/category.module'
import { ChatMessageModule } from '../../chat/models/chat-massege.model'

@ObjectType()
export class StreamModel implements Stream {
	@Field(() => ID)
	public id: string

	@Field(() => String)
	public title: string

	@Field(() => String, { nullable: true })
	public thumbnailUrl: string

	@Field(() => String, { nullable: true })
	public ingressId: string

	@Field(() => String, { nullable: true })
	public streamKey: string

	@Field(() => String, { nullable: true })
	public serverUrl: string

	@Field(() => Boolean)
	public isChatEnabled: boolean

	@Field(() => Boolean)
	public isChatFollowersOnly: boolean

	@Field(() => Boolean)
	public isChatPremiumFollowersOnly: boolean

	@Field(() => Boolean)
	public isLive: boolean

	@Field(() => UserModel)
	public user: UserModel
	@Field(() => CategoryModel, { nullable: true })
	public category: CategoryModel

	@Field(() => String, { nullable: true })
	public categoryId: string
	
	@Field(() => [ChatMessageModule])
	public chatMessage: ChatMessageModule

	@Field(() => String)
	public userId: string

	@Field(() => Date)
	public createdAt: Date

	@Field(() => Date)
	public updatedAt: Date
}
