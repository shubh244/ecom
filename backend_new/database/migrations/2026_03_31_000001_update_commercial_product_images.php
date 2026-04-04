<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Refresh dummy images for commercial catalogue products (Unsplash, furniture-relevant).
 * firstOrCreate in seeders does not update image when the row already exists.
 */
return new class extends Migration
{
    public function up(): void
    {
        foreach ($this->imageMap() as $name => $image) {
            DB::table('products')->where('name', $name)->update(['image' => $image]);
        }
    }

    public function down(): void
    {
        // No safe rollback without storing previous URLs
    }

    /** @return array<string, string> */
    private function imageMap(): array
    {
        $q = 'auto=format&fit=crop&w=800&q=80';

        return [
            'Shreejee Blessings Wood Executive L-Shaped Office Desk (Walnut)' => "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?{$q}",
            'Ergonomic Mesh Office Chair with Lumbar Support' => "https://images.unsplash.com/photo-1505843490533-1e2fe9dca9a8?{$q}",
            '8-Seater Conference Table (Oak Finish)' => "https://images.unsplash.com/photo-1497366754035-f200968a6e72?{$q}",
            'Weather-Resistant 5-Seater Outdoor Sofa Set (Grey Wicker)' => "https://images.unsplash.com/photo-1600210492493-0946911123ea?{$q}",
            'Teak Wood Outdoor Dining Set (6-Seater)' => "https://images.unsplash.com/photo-1604076913837-1ab2fff0ebd3?{$q}",
            'Adjustable Sun Lounger with Side Table' => "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?{$q}",
            'Upholstered Restaurant Dining Chair (Commercial Grade)' => "https://images.unsplash.com/photo-1555992336-fc0fc35f9c2c?{$q}",
            'Hotel Lobby 3-Seater Sofa (Velvet)' => "https://images.unsplash.com/photo-1566664037898-5ceb7e577367?{$q}",
            'Solid Wood Restaurant Table (4-Seater)' => "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?{$q}",
            'Folding Banquet Table (6ft x 2.5ft)' => "https://images.unsplash.com/photo-1464366400600-7161149a31f0?{$q}",
            'Stackable Banquet Chair with Cushion (Gold Frame)' => "https://images.unsplash.com/photo-1520854221056-975275d38554?{$q}",
            'Round Banquet Table (8-Seater, White Top)' => "https://images.unsplash.com/photo-1519167758481-83f29da3a0a6?{$q}",
            'Student Desk & Chair Combo (Primary)' => "https://images.unsplash.com/photo-1509062522246-375597792107?{$q}",
            'Library Reading Table with Bench Seating' => "https://images.unsplash.com/photo-1521587760476-6c12a4b04090?{$q}",
            'Science Lab Stool (Adjustable Height)' => "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?{$q}",
            'Hospital Attendant Bed with Side Rails' => "https://images.unsplash.com/photo-1631217867871-6ca056537311?{$q}",
            'Waiting Room 4-Seater Bench (PU Seat)' => "https://images.unsplash.com/photo-1516549655169-650c10cfd3d5?{$q}",
            'Medical Storage Cabinet (Lockable)' => "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?{$q}",
            'Bespoke Wardrobe — Design Consultation & Build' => "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?{$q}",
            'Made-to-Order Solid Wood Dining Table' => "https://images.unsplash.com/photo-1617806118233-18e1de247200?{$q}",
            'Custom TV Unit & Wall Panel System' => "https://images.unsplash.com/photo-1595526114035-0f45b6705df2?{$q}",
        ];
    }
};
