import { Request, Response, NextFunction } from 'express';
import { DiscussionService } from '@uaip/shared-services';
import { logger, ApiError } from '@uaip/utils';
import { 
  Discussion,
  CreateDiscussionRequest,
  UpdateDiscussionRequest,
  DiscussionSearchFilters,
  DiscussionAnalytics,
  DiscussionMessage,
  MessageType,
  ParticipantRole
} from '@uaip/types';

export class DiscussionController {
  private discussionService: DiscussionService;

  constructor(discussionService: DiscussionService) {
    this.discussionService = discussionService;
  }

  public async createDiscussion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const createRequest: CreateDiscussionRequest = req.body;

      logger.info('Creating new discussion', { 
        title: createRequest.title,
        createdBy: createRequest.createdBy,
        participantCount: createRequest.initialParticipants?.length
      });

      const discussion = await this.discussionService.createDiscussion(createRequest);

      logger.info('Discussion created successfully', { 
        discussionId: discussion.id,
        title: discussion.title
      });

      res.status(201).json({
        success: true,
        data: discussion,
        meta: {
          timestamp: new Date(),
          version: '1.0.0'
        }
      });

    } catch (error) {
      logger.error('Error creating discussion', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        requestBody: req.body
      });
      next(error);
    }
  }

  public async getDiscussion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { discussionId } = req.params;

      logger.info('Retrieving discussion', { discussionId });

      const discussion = await this.discussionService.getDiscussion(discussionId);
      if (!discussion) {
        throw new ApiError(404, 'Discussion not found', 'DISCUSSION_NOT_FOUND');
      }

      res.status(200).json({
        success: true,
        data: discussion,
        meta: {
          timestamp: new Date(),
          version: '1.0.0'
        }
      });

    } catch (error) {
      logger.error('Error retrieving discussion', { 
        discussionId: req.params.discussionId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  public async updateDiscussion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { discussionId } = req.params;
      const updateRequest: UpdateDiscussionRequest = req.body;

      logger.info('Updating discussion', { 
        discussionId,
        updates: Object.keys(updateRequest)
      });

      const discussion = await this.discussionService.updateDiscussion(discussionId, updateRequest);

      logger.info('Discussion updated successfully', { 
        discussionId,
        title: discussion.title
      });

      res.status(200).json({
        success: true,
        data: discussion,
        meta: {
          timestamp: new Date(),
          version: '1.0.0'
        }
      });

    } catch (error) {
      logger.error('Error updating discussion', { 
        discussionId: req.params.discussionId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  public async startDiscussion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { discussionId } = req.params;
      const { startedBy } = req.body;

      logger.info('Starting discussion', { discussionId, startedBy });

      const discussion = await this.discussionService.startDiscussion(discussionId, startedBy);

      logger.info('Discussion started successfully', { 
        discussionId,
        status: discussion.status
      });

      res.status(200).json({
        success: true,
        data: discussion,
        meta: {
          timestamp: new Date(),
          version: '1.0.0'
        }
      });

    } catch (error) {
      logger.error('Error starting discussion', { 
        discussionId: req.params.discussionId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  public async endDiscussion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { discussionId } = req.params;
      const { endedBy, reason } = req.body;

      logger.info('Ending discussion', { discussionId, endedBy, reason });

      const discussion = await this.discussionService.endDiscussion(discussionId, endedBy, reason);

      logger.info('Discussion ended successfully', { 
        discussionId,
        status: discussion.status
      });

      res.status(200).json({
        success: true,
        data: discussion,
        meta: {
          timestamp: new Date(),
          version: '1.0.0'
        }
      });

    } catch (error) {
      logger.error('Error ending discussion', { 
        discussionId: req.params.discussionId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  public async addParticipant(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { discussionId } = req.params;
      const participantRequest = req.body;

      logger.info('Adding participant to discussion', { 
        discussionId,
        personaId: participantRequest.personaId,
        agentId: participantRequest.agentId
      });

      const participant = await this.discussionService.addParticipant(discussionId, participantRequest);

      logger.info('Participant added successfully', { 
        discussionId,
        participantId: participant.id
      });

      res.status(201).json({
        success: true,
        data: participant,
        meta: {
          timestamp: new Date(),
          version: '1.0.0'
        }
      });

    } catch (error) {
      logger.error('Error adding participant', { 
        discussionId: req.params.discussionId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  public async removeParticipant(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { discussionId, participantId } = req.params;
      const { removedBy } = req.body;

      logger.info('Removing participant from discussion', { 
        discussionId,
        participantId,
        removedBy
      });

      await this.discussionService.removeParticipant(discussionId, participantId, removedBy);

      logger.info('Participant removed successfully', { 
        discussionId,
        participantId
      });

      res.status(204).send();

    } catch (error) {
      logger.error('Error removing participant', { 
        discussionId: req.params.discussionId,
        participantId: req.params.participantId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  public async sendMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { discussionId, participantId } = req.params;
      const { content, messageType = MessageType.MESSAGE } = req.body;

      logger.info('Sending message to discussion', { 
        discussionId,
        participantId,
        messageType,
        contentLength: content?.length
      });

      const message = await this.discussionService.sendMessage(
        discussionId, 
        participantId, 
        content, 
        messageType
      );

      logger.info('Message sent successfully', { 
        discussionId,
        messageId: message.id
      });

      res.status(201).json({
        success: true,
        data: message,
        meta: {
          timestamp: new Date(),
          version: '1.0.0'
        }
      });

    } catch (error) {
      logger.error('Error sending message', { 
        discussionId: req.params.discussionId,
        participantId: req.params.participantId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  public async getMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { discussionId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string);

      logger.info('Retrieving discussion messages', { 
        discussionId,
        limit,
        offset
      });

      const result = await this.discussionService.getMessages(discussionId, limit, offset);

      res.status(200).json({
        success: true,
        data: result.messages,
        pagination: {
          total: result.total,
          limit,
          offset,
          hasMore: result.hasMore
        },
        meta: {
          timestamp: new Date(),
          version: '1.0.0'
        }
      });

    } catch (error) {
      logger.error('Error retrieving messages', { 
        discussionId: req.params.discussionId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  public async advanceTurn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { discussionId } = req.params;
      const { forcedBy } = req.body;

      logger.info('Advancing discussion turn', { discussionId, forcedBy });

      await this.discussionService.advanceTurn(discussionId, forcedBy);

      logger.info('Discussion turn advanced successfully', { discussionId });

      res.status(200).json({
        success: true,
        message: 'Turn advanced successfully',
        meta: {
          timestamp: new Date(),
          version: '1.0.0'
        }
      });

    } catch (error) {
      logger.error('Error advancing turn', { 
        discussionId: req.params.discussionId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }

  public async searchDiscussions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters: DiscussionSearchFilters = {
        query: req.query.query as string,
        status: req.query.status as any,
        createdBy: req.query.createdBy ? 
          (req.query.createdBy as string).split(',') : undefined,
        participants: req.query.participantId ? 
          (req.query.participantId as string).split(',') : undefined,
        tags: req.query.tags ? 
          (req.query.tags as string).split(',') : undefined,
        createdAfter: req.query.startDate ? 
          new Date(req.query.startDate as string) : undefined,
        createdBefore: req.query.endDate ? 
          new Date(req.query.endDate as string) : undefined
      };

      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string);

      logger.info('Searching discussions', { 
        filters: Object.keys(filters).filter(key => filters[key as keyof DiscussionSearchFilters] !== undefined),
        limit,
        offset
      });

      const result = await this.discussionService.searchDiscussions(filters, limit, offset);

      res.status(200).json({
        success: true,
        data: result.discussions,
        pagination: {
          total: result.total,
          limit,
          offset,
          hasMore: result.hasMore
        },
        meta: {
          timestamp: new Date(),
          version: '1.0.0'
        }
      });

    } catch (error) {
      logger.error('Error searching discussions', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        query: req.query
      });
      next(error);
    }
  }

  public async getDiscussionAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { discussionId } = req.params;
      const timeframe = req.query.start && req.query.end ? {
        start: new Date(req.query.start as string),
        end: new Date(req.query.end as string)
      } : undefined;

      logger.info('Retrieving discussion analytics', { discussionId, timeframe });

      const analytics = await this.discussionService.getDiscussionAnalytics(discussionId, timeframe);
      if (!analytics) {
        throw new ApiError(404, 'Discussion analytics not found', 'ANALYTICS_NOT_FOUND');
      }

      res.status(200).json({
        success: true,
        data: analytics,
        meta: {
          timestamp: new Date(),
          version: '1.0.0'
        }
      });

    } catch (error) {
      logger.error('Error retrieving discussion analytics', { 
        discussionId: req.params.discussionId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  }
} 