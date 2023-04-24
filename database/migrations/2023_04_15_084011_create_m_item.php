<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMItem extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('m_item', function (Blueprint $table) {
            $table->bigIncrements('id')->comment('Primary key');
            $table->string('hash_id', 128)
                ->nullable(true)
                ->comment('hash ID');
            $table->string('name', 30)
                ->comment('Item name');
            $table->string('segment_code', 5)
                ->default('00001')
                ->comment('Product classification code');
            $table->integer('price')
                ->comment('Item price');
            $table->string('image_folder_path', 128)
                ->nullable(true)
                ->comment('Image folder path');
            $table->string('image_file_name', 50)
                ->nullable(true)
                ->comment('Image file name');
            $table->float('review_rate')
                ->nullable(true)
                ->comment('Rating Rating: Average user review rating');
            $table->string('status', 10)
                ->default('onsale')
                ->comment('Sale status: onsale|not_onsale');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')
                ->default(DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
            $table->softDeletes();
            $table->unsignedBigInteger('modified_by')
                ->nullable(true)
                ->comment('Last Modified By: Saves the s_account.id of the last modified person');
            $table->unique('hash_id');
        });
        DB::statement("ALTER TABLE `m_item` comment 'Item master data'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('m_item');
    }
}
