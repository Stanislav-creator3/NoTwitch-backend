import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql'
import { PubSub } from 'graphql-subscriptions'
import { User } from '@/prisma/generated'
import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'
import { ChatService } from './chat.service'
import { ChangeChatSettingsInput } from './inputs/change-chat-settings.input'
import { SendMassageInput } from './inputs/send-massege.input'
import { ChatMessageModule } from './models/chat-massege.model'

@Resolver('Chat')
export class ChatResolver {
	private readonly pubSub: PubSub

	public constructor(private readonly chatService: ChatService) {
		this.pubSub = new PubSub()
	}

	@Query(() => [ChatMessageModule], { name: 'findByStream' })
	public async findByStream(@Args('streamId') streamId: string) {
		return this.chatService.findByStream(streamId)
	}

	@Authorization()
	@Mutation(() => ChatMessageModule, { name: 'sendMessage' })
	public async sendMessage(
		@Authorized('id') userId: string,
		@Args('data') input: SendMassageInput
	) {
		const message = await this.chatService.sendMassage(userId, input)
		this.pubSub.publish('CHAT_MESSAGE_ADDED', { chatMessageAdded: message })

		return message
	}

	@Subscription(() => ChatMessageModule, {
		name: 'chatMessageAdded',
		filter: (payload, variables) =>
			payload.chatMessageAdded.streamId === variables.streamId
	})
	public async chatMessageAdded(@Args('streamId') streamId: string) {
		return this.pubSub.asyncIterableIterator('CHAT_MESSAGE_ADDED')
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'changeSettings' })
	public async changeSetting(
		@Authorized() user: User,
		@Args('data') input: ChangeChatSettingsInput
	) {
		return this.chatService.changeSettings(user, input)
	}
}
