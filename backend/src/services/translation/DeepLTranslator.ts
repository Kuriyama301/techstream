/**
 * DeepL Translation Service
 * RSSのdescriptionを英語→日本語に翻訳
 */
import * as deepl from 'deepl-node';

export class DeepLTranslator {
  private translator: deepl.Translator;
  private enabled: boolean;

  constructor() {
    const apiKey = process.env.DEEPL_API_KEY;

    if (!apiKey || apiKey === 'your_deepl_api_key_here') {
      console.warn('⚠️  DeepL API Key not configured. Translation disabled.');
      this.enabled = false;
      // ダミーのtranslatorを作成（エラーを防ぐため）
      this.translator = {} as deepl.Translator;
    } else {
      this.translator = new deepl.Translator(apiKey);
      this.enabled = true;
      console.log('✅ DeepL Translator initialized');
    }
  }

  /**
   * 英語テキストを日本語に翻訳
   * @param text 翻訳するテキスト
   * @returns 翻訳されたテキスト（失敗時は元のテキスト）
   */
  async translateToJapanese(text: string): Promise<string> {
    // DeepLが無効な場合は元のテキストを返す
    if (!this.enabled) {
      return text;
    }

    // 空文字列や短すぎるテキストはスキップ
    if (!text || text.trim().length < 5) {
      return text;
    }

    try {
      const result = await this.translator.translateText(
        text,
        'en', // ソース言語: 英語
        'ja'  // ターゲット言語: 日本語
      );

      return result.text;
    } catch (error) {
      console.error('❌ Translation failed:', error);
      // 翻訳失敗時は元のテキストを返す
      return text;
    }
  }

  /**
   * 複数のテキストを一括翻訳（効率化のため）
   * @param texts 翻訳するテキストの配列
   * @returns 翻訳されたテキストの配列
   */
  async translateBatch(texts: string[]): Promise<string[]> {
    if (!this.enabled) {
      return texts;
    }

    // 空配列の場合は早期リターン
    if (texts.length === 0) {
      return [];
    }

    try {
      // 空文字列や短すぎるテキストをフィルタ
      const validTexts = texts.filter((t) => t && t.trim().length >= 5);

      if (validTexts.length === 0) {
        return texts;
      }

      const results = await this.translator.translateText(
        validTexts,
        'en',
        'ja'
      );

      // 結果を配列に変換（型アサーション）
      if (Array.isArray(results)) {
        return results.map((r: any) => r.text);
      } else {
        return [(results as any).text];
      }
    } catch (error) {
      console.error('❌ Batch translation failed:', error);
      return texts;
    }
  }

  /**
   * DeepLの使用状況を取得（Free APIの場合は月間500,000文字まで）
   */
  async getUsage(): Promise<deepl.Usage | null> {
    if (!this.enabled) {
      return null;
    }

    try {
      const usage = await this.translator.getUsage();
      console.log('📊 DeepL Usage:');
      console.log(`   Characters used: ${usage.character?.count || 0}`);
      console.log(`   Character limit: ${usage.character?.limit || 'unlimited'}`);
      return usage;
    } catch (error) {
      console.error('❌ Failed to get usage:', error);
      return null;
    }
  }
}

// シングルトンインスタンス
export const translator = new DeepLTranslator();
