import { Category } from './Category';
import { connectDatabase, disconnectDatabase, clearDatabase } from '../config/database';

describe('Category Model', () => {
  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.MONGODB_URI = 'mongodb://localhost:27017/techstream_test';
    await connectDatabase();
  }, 30000);

  afterAll(async () => {
    await disconnectDatabase();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  describe('Category creation', () => {
    it('should create a valid category with required fields', async () => {
      const categoryData = {
        name: 'Python',
        slug: 'python',
        type: 'language' as const,
        displayOrder: 1,
        isActive: true,
      };

      const category = new Category(categoryData);
      const savedCategory = await category.save();

      expect(savedCategory._id).toBeDefined();
      expect(savedCategory.name).toBe('Python');
      expect(savedCategory.slug).toBe('python');
      expect(savedCategory.type).toBe('language');
      expect(savedCategory.createdAt).toBeDefined();
    });

    it('should fail when required fields are missing', async () => {
      const invalidCategory = new Category({});

      await expect(invalidCategory.save()).rejects.toThrow();
    });

    it('should enforce unique slug constraint', async () => {
      const categoryData = {
        name: 'JavaScript',
        slug: 'javascript',
        type: 'language' as const,
        displayOrder: 2,
        isActive: true,
      };

      await new Category(categoryData).save();

      const duplicateCategory = new Category(categoryData);
      await expect(duplicateCategory.save()).rejects.toThrow();
    });
  });

  describe('Category validation', () => {
    it('should validate type enum', async () => {
      const invalidCategory = new Category({
        name: 'Test',
        slug: 'test',
        type: 'invalid' as any,
        displayOrder: 1,
        isActive: true,
      });

      await expect(invalidCategory.save()).rejects.toThrow();
    });

    it('should have default value for isActive (true)', async () => {
      const category = new Category({
        name: 'Go',
        slug: 'go',
        type: 'language' as const,
        displayOrder: 3,
      });

      const savedCategory = await category.save();
      expect(savedCategory.isActive).toBe(true);
    });

    it('should have default value for stats.articleCount (0)', async () => {
      const category = new Category({
        name: 'Rust',
        slug: 'rust',
        type: 'language' as const,
        displayOrder: 4,
        isActive: true,
      });

      const savedCategory = await category.save();
      expect(savedCategory.stats?.articleCount).toBe(0);
    });
  });

  describe('Category queries', () => {
    beforeEach(async () => {
      await Category.create([
        {
          name: 'Python',
          slug: 'python',
          type: 'language',
          displayOrder: 1,
          isActive: true,
          color: '#3776ab',
          stats: { articleCount: 100 },
        },
        {
          name: 'JavaScript',
          slug: 'javascript',
          type: 'language',
          displayOrder: 2,
          isActive: true,
          color: '#f7df1e',
          stats: { articleCount: 150 },
        },
        {
          name: 'Web Development',
          slug: 'web-dev',
          type: 'domain',
          displayOrder: 3,
          isActive: true,
          stats: { articleCount: 200 },
        },
        {
          name: 'Inactive Category',
          slug: 'inactive',
          type: 'language',
          displayOrder: 99,
          isActive: false,
          stats: { articleCount: 0 },
        },
      ]);
    });

    it('should find only active categories', async () => {
      const categories = await Category.find({ isActive: true });
      expect(categories).toHaveLength(3);
    });

    it('should find categories by type', async () => {
      const languages = await Category.find({ type: 'language', isActive: true });
      expect(languages).toHaveLength(2);

      const domains = await Category.find({ type: 'domain' });
      expect(domains).toHaveLength(1);
      expect(domains[0].name).toBe('Web Development');
    });

    it('should sort categories by displayOrder', async () => {
      const categories = await Category.find({ isActive: true }).sort({
        displayOrder: 1,
      });

      expect(categories[0].slug).toBe('python');
      expect(categories[1].slug).toBe('javascript');
      expect(categories[2].slug).toBe('web-dev');
    });

    it('should find category by slug', async () => {
      const category = await Category.findOne({ slug: 'python' });

      expect(category).toBeDefined();
      expect(category?.name).toBe('Python');
      expect(category?.color).toBe('#3776ab');
    });
  });

  describe('Category statistics', () => {
    it('should update article count', async () => {
      const category = await Category.create({
        name: 'TypeScript',
        slug: 'typescript',
        type: 'language' as const,
        displayOrder: 5,
        isActive: true,
      });

      category.stats = {
        articleCount: 50,
        lastUpdatedAt: new Date(),
      };

      await category.save();

      const updated = await Category.findById(category._id);
      expect(updated?.stats?.articleCount).toBe(50);
      expect(updated?.stats?.lastUpdatedAt).toBeDefined();
    });
  });
});
