<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use App\Models\MCountry;

class MCountrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('m_country')->truncate();
        $countries = json_decode(File::get('database/data/countries.json'));
        foreach ($countries as $item) {
            $data = collect($item)->toArray();
            $data['english_name'] = strtolower($data['english_name']);
            $data['code'] = strtoupper($data['code']);
            MCountry::create($data);
        }
    }
}
