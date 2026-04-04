<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create Categories
        $categories = [
            ['name' => 'Sofa Sets', 'slug' => 'sofa-sets'],
            ['name' => 'Dining Table Sets', 'slug' => 'dining-table-sets'],
            ['name' => 'Beds', 'slug' => 'beds'],
            ['name' => 'TV Units', 'slug' => 'tv-units'],
            ['name' => 'Book Shelves', 'slug' => 'book-shelves'],
            ['name' => 'Coffee Tables', 'slug' => 'coffee-tables'],
            ['name' => 'Study Tables', 'slug' => 'study-tables'],
            ['name' => 'Home Decor', 'slug' => 'home-decor'],
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(['slug' => $category['slug']], $category);
        }

        // Create Sample Products
        $bedCategory = Category::where('slug', 'beds')->first();
        $sofaCategory = Category::where('slug', 'sofa-sets')->first();

        if ($bedCategory) {
            Product::firstOrCreate(
                ['name' => 'Shreejee Blessings Wood Daffodil King Bed with Box Storage (Walnut)'],
                [
                    'price' => 21990,
                    'original_price' => 69000,
                    'category_id' => $bedCategory->id,
                    'subcategory' => 'King Size Beds',
                    'image' => '/products/bed1.jpg',
                    'rating' => 4.5,
                    'reviews' => 0,
                    'in_stock' => true,
                    'is_featured' => true,
                    'hot_offer' => true,
                    'offer_percentage' => 68,
                ]
            );

            Product::firstOrCreate(
                ['name' => 'Shreejee Blessings Wood King Bed without Storage (Walnut)'],
                [
                    'price' => 15500,
                    'original_price' => 50000,
                    'category_id' => $bedCategory->id,
                    'subcategory' => 'King Size Beds',
                    'image' => '/products/bed2.jpg',
                    'rating' => 4.5,
                    'reviews' => 0,
                    'in_stock' => true,
                    'is_featured' => true,
                    'hot_offer' => true,
                    'offer_percentage' => 69,
                ]
            );
        }

        if ($sofaCategory) {
            Product::firstOrCreate(
                ['name' => 'Duroflex Ease 3 Seater Fabric Sofa In Beige Colour'],
                [
                    'price' => 19152,
                    'original_price' => 33600,
                    'category_id' => $sofaCategory->id,
                    'subcategory' => '3-Seaters Sofas',
                    'image' => 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
                    'rating' => 4.5,
                    'reviews' => 0,
                    'in_stock' => true,
                    'is_featured' => true,
                    'hot_offer' => true,
                    'offer_percentage' => 43,
                ]
            );
        }

        // Seed additional products
        $this->call(ProductSeeder::class);
    }
}

