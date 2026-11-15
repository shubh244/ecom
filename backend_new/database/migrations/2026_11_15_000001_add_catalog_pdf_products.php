<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Insert dining sets, sofa-catalogue sofas, and luxury sofas photographed from the PDFs.
 * Existing rows with the same name are left unchanged.
 */
return new class extends Migration
{
    public function up(): void
    {
        $path = database_path('data/catalog-products.json');
        if (!is_file($path)) {
            return;
        }

        $products = json_decode(file_get_contents($path), true);
        if (!is_array($products)) {
            return;
        }

        $now = now();
        $categoryNames = [
            'sofa-sets' => 'Sofa Sets',
            'dining-table-sets' => 'Dining Table Sets',
        ];

        foreach ($products as $product) {
            $slug = $product['category'];
            $categoryId = DB::table('categories')->where('slug', $slug)->value('id');
            if (!$categoryId && isset($categoryNames[$slug])) {
                $categoryId = DB::table('categories')->insertGetId([
                    'name' => $categoryNames[$slug],
                    'slug' => $slug,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
            if (!$categoryId) {
                continue;
            }

            $exists = DB::table('products')->where('name', $product['name'])->exists();
            if ($exists) {
                continue;
            }

            DB::table('products')->insert([
                'name' => $product['name'],
                'price' => $product['price'],
                'original_price' => $product['original_price'],
                'category_id' => $categoryId,
                'subcategory' => $product['subcategory'],
                'description' => $product['description'],
                'image' => $product['image'],
                'rating' => $product['rating'],
                'reviews' => $product['reviews'],
                'in_stock' => $product['in_stock'],
                'is_featured' => $product['is_featured'],
                'hot_offer' => $product['hot_offer'],
                'offer_percentage' => $product['offer_percentage'],
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }

    public function down(): void
    {
        $path = database_path('data/catalog-products.json');
        if (!is_file($path)) {
            return;
        }

        $products = json_decode(file_get_contents($path), true);
        if (!is_array($products)) {
            return;
        }

        DB::table('products')->whereIn('name', array_column($products, 'name'))->delete();
    }
};
