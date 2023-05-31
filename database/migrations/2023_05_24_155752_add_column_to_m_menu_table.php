<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnToMMenuTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('m_menu', function (Blueprint $table) {
            $table->unsignedBigInteger('main_image_id')
                ->nullable()
                ->after('image_file_name');
            $table->tinyInteger('initial_order_flg')
                ->after('is_course_only')
                ->default(0);
            $table->boolean('is_recommend')
                ->after('initial_order_flg')
                ->nullable()
                ->default(0);
            $table->boolean('is_promotion')
                ->after('is_recommend')
                ->nullable()
                ->default(0);
            $table->integer('estimated_preparation_time')
                ->nullable()
                ->after('is_promotion')
                ->comment('Estimated preparation cook time');
            $table->bigInteger('shop_cook_place_id')
                ->nullable()
                ->after('estimated_preparation_time')
                ->comment('Cook place');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('m_menu', function (Blueprint $table) {
            $table->dropColumn('main_image_id');
            $table->dropColumn('tax_value');
            $table->dropColumn('m_tax_id');
            $table->dropColumn('initial_order_flg');
            $table->dropColumn('is_recommend');
            $table->dropColumn('is_promotion');
            $table->dropColumn('estimated_preparation_time');
            $table->dropColumn('shop_cook_place_id');
        });
    }
}
