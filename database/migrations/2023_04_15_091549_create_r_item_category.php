<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRItemCategory extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('r_item_category', function (Blueprint $table) {
            $table->bigIncrements('id')->comment('Primary key');
            $table->unsignedBigInteger('m_item_id')
                ->comment('FK reference to item');
            $table->unsignedBigInteger('m_category_id')
                ->comment('FK reference to category');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')
                ->default(DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
            $table->softDeletes();
            $table->unsignedBigInteger('modified_by')
                ->nullable(true)
                ->comment('Last Modified By: Saves the s_account.id of the last modified person');
            $table->foreign('m_item_id')
                ->references('id')
                ->on('m_item');
            $table->foreign('m_category_id')
                ->references('id')
                ->on('m_category');
            $table->index(['m_item_id', 'm_category_id']);
        });
        DB::statement("ALTER TABLE `r_item_category` comment 'Item x Category Relationship'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('r_item_category');
    }
}
