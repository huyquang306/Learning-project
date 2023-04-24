<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\MTableDefault;

class MTableDefaultSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('m_table_default')->truncate();
        $codes = [
            '01',
            '02',
            '03',
            '04',
            '05',
            '06',
            '07',
            '08',
            '09',
            '10',
        ];
        foreach ($codes as $code) {
            MTableDefault::create([
                'code' => $code,
            ]);
        }
    }
}
