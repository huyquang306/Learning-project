<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\MGenre;

class MGenreTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $genres = [
            ['vietnam', 'Món ăn Việt Nam'],
            ['western', 'Món ăn phương Tây'],
            ['china', 'Món ăn Trung Quốc'],
            ['asia', 'Món ăn Châu Á'],
            ['hotpot', 'Quán lẩu'],
            ['bbq', 'Quán nướng'],
            ['noodle', 'Mì'],
            ['cafe', 'Cafe'],
            ['bread', 'Bánh mì'],
            ['bar', 'Quán bar'],
            ['other', 'Khác']
        ];
        foreach ($genres as $genre) {
            MGenre::create(['code'=>$genre[0], 'name'=>$genre[1]]);
        }
    }
}
