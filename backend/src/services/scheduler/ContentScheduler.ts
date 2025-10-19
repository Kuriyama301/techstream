import cron, { ScheduledTask } from 'node-cron';
import { Source } from '../../models';
import { RSSCollector } from '../rss/RSSCollector';

/**
 * RSS記事の定期自動収集を管理するスケジューラー
 */
export class ContentScheduler {
  private task: ScheduledTask | null = null;
  private collector: RSSCollector;
  private running: boolean = false;

  constructor() {
    this.collector = new RSSCollector();
  }

  /**
   * スケジューラーを開始
   * デフォルト: 1時間ごとに実行
   */
  start(cronExpression: string = '0 * * * *'): void {
    if (this.running) {
      console.log('⚠️  ContentScheduler is already running');
      return;
    }

    this.task = cron.schedule(cronExpression, async () => {
      console.log('⏰ Scheduled RSS collection started...');
      await this.collectFromAllSources();
    });

    this.running = true;
    console.log(`✅ ContentScheduler started (cron: ${cronExpression})`);
  }

  /**
   * スケジューラーを停止
   */
  stop(): void {
    if (!this.running) {
      console.log('⚠️  ContentScheduler is not running');
      return;
    }

    if (this.task) {
      this.task.stop();
      this.task = null;
    }

    this.running = false;
    console.log('🛑 ContentScheduler stopped');
  }

  /**
   * スケジューラーが実行中かどうか
   */
  isRunning(): boolean {
    return this.running;
  }

  /**
   * 全アクティブソースからRSS記事を収集
   */
  async collectFromAllSources(): Promise<void> {
    try {
      console.log('📡 Starting RSS collection from all active sources...');

      // アクティブなソースを取得
      const sources = await Source.find({ isActive: true }).sort({ tier: 1 });

      if (sources.length === 0) {
        console.log('⚠️  No active sources found');
        return;
      }

      console.log(`📋 Found ${sources.length} active sources`);

      let successCount = 0;
      let errorCount = 0;

      // 各ソースから順番に収集
      for (const source of sources) {
        try {
          console.log(`🔄 Collecting from: ${source.name}`);
          await this.collector.fetchFromSource(source._id.toString());
          successCount++;
        } catch (error) {
          console.error(`❌ Failed to collect from ${source.name}:`, error);
          errorCount++;
        }
      }

      console.log(
        `✨ Collection completed: ${successCount} succeeded, ${errorCount} failed`
      );
    } catch (error) {
      console.error('❌ Error during RSS collection:', error);
    }
  }

  /**
   * 即座に1回だけ収集を実行（手動トリガー用）
   */
  async runOnce(): Promise<void> {
    console.log('🚀 Manual RSS collection triggered');
    await this.collectFromAllSources();
  }
}
