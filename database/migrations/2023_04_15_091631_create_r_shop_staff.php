<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRShopStaff extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('r_shop_staff', function (Blueprint $table) {
            $table->bigIncrements('id')->comment('Primary key');
            $table->unsignedBigInteger('m_shop_id')
                ->comment('Fk reference to shop');
            $table->unsignedBigInteger('m_staff_id')
                ->comment('Fk reference to staff');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')
                ->default(DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
            $table->softDeletes()->comment('削除日時');
            $table->unsignedBigInteger('modified_by')
                ->nullable(true)
                ->comment('Last Modified By: Saves the s_account.id of the last modified person');
            $table->foreign('m_shop_id')
                ->references('id')
                ->on('m_shop');
            $table->foreign('m_staff_id')
                ->references('id')
                ->on('m_staff');
            $table->index(['m_shop_id', 'm_staff_id']);
            $table->index(['m_shop_id']);
            $table->index(['m_staff_id']);
        });
        DB::statement("ALTER TABLE `r_shop_staff` comment 'Shop x Staff relationship'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('r_shop_staff');
    }
}
