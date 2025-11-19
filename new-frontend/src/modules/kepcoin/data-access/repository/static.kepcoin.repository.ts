import type { KepcoinPageContent } from '../../domain/entities/kepcoin.entity';
import type { KepcoinRepository } from '../../domain/ports/kepcoin.repository';

export class StaticKepcoinRepository implements KepcoinRepository {
  getPageContent(): KepcoinPageContent {
    return {
      summary: {
        balance: 1418,
        streak: 0,
        streakFreeze: 0,
      },
      transactions: {
        earns: [
          {
            id: 'earn-1',
            amount: 10,
            datetime: '2024-10-04T08:45:00Z',
            title: 'Daily activity reward',
            description: 'Earned for keeping your login streak alive.',
            type: 'earn',
          },
          {
            id: 'earn-2',
            amount: 35,
            datetime: '2024-09-27T12:10:00Z',
            title: 'Weekly challenge winner',
            description: 'Top spot in the weekly problem challenge.',
            type: 'earn',
          },
          {
            id: 'earn-3',
            amount: 5,
            datetime: '2024-09-18T16:25:00Z',
            title: 'Completed all daily tasks',
            description: 'Finished the entire checklist of daily learning tasks.',
            type: 'earn',
          },
        ],
        spends: [
          {
            id: 'spend-1',
            amount: 5,
            datetime: '2024-10-02T14:40:00Z',
            title: 'Profile cover update',
            description: 'Changed the cover photo on your public profile.',
            type: 'spend',
          },
          {
            id: 'spend-2',
            amount: 12,
            datetime: '2024-09-22T10:05:00Z',
            title: 'Viewed a failed test',
            description: 'Unlocked test details for a failed solution.',
            type: 'spend',
          },
          {
            id: 'spend-3',
            amount: 48,
            datetime: '2024-09-15T18:15:00Z',
            title: 'Problem solution purchase',
            description: 'Bought the editorial for a hard algorithmic problem.',
            type: 'spend',
          },
        ],
      },
      guides: {
        earn: [
          { id: 'earn-activity', value: '1', labelKey: 'kepcoinPage.guides.earn.items.activity' },
          { id: 'earn-daily-tasks', value: '1-10', labelKey: 'kepcoinPage.guides.earn.items.dailyTasks' },
          { id: 'earn-challenges', value: '3, 10, 50', labelKey: 'kepcoinPage.guides.earn.items.challengeRatings' },
          { id: 'earn-competitions', value: '5+', labelKey: 'kepcoinPage.guides.earn.items.competitions' },
          { id: 'earn-blog', value: '10-100', labelKey: 'kepcoinPage.guides.earn.items.blog' },
          { id: 'earn-editing', value: '1-50', labelKey: 'kepcoinPage.guides.earn.items.editing' },
        ],
        spend: [
          { id: 'spend-attempt', value: '0-14', labelKey: 'kepcoinPage.guides.spend.items.viewAttempt' },
          { id: 'spend-test', value: '1', labelKey: 'kepcoinPage.guides.spend.items.viewTest' },
          { id: 'spend-solution', value: '2-50', labelKey: 'kepcoinPage.guides.spend.items.solution' },
          { id: 'spend-cover', value: '5', labelKey: 'kepcoinPage.guides.spend.items.cover' },
          { id: 'spend-pass-test', value: '1', labelKey: 'kepcoinPage.guides.spend.items.passTest' },
          { id: 'spend-course', value: '1-1000', labelKey: 'kepcoinPage.guides.spend.items.course' },
          { id: 'spend-test-function', value: '10', labelKey: 'kepcoinPage.guides.spend.items.testFunction' },
          { id: 'spend-double-rating', value: '25', labelKey: 'kepcoinPage.guides.spend.items.doubleRating' },
          { id: 'spend-keep-rating', value: '25', labelKey: 'kepcoinPage.guides.spend.items.keepRating' },
        ],
      },
    };
  }
}
