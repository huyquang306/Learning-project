<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTOrderTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('t_order', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('t_ordergroup_id')
                ->nullable(false);
            $table->unsignedBigInteger('r_shop_menu_id')
                ->nullable(false);
            $table->unsignedInteger('m_staff_id')
                ->nullable();
            $table->unsignedInteger('r_shop_course_id')
                ->nullable();
            $table->string('menu_name')
                ->nullable();
            $table->tinyInteger('status')
                ->default(0);
            $table->integer('price_unit')
                ->nullable(false)
                ->default(0);
            $table->unsignedInteger('quantity')
                ->nullable(false)
                ->default(0);
            $table->float('amount')
                ->nullable(false)
                ->default(0);
            $table->timestamp('ordered_at')
                ->nullable(false);
            $table->tinyInteger('order_type')
                ->nullable();
            $table->float('tax_rate')
                ->default(0);
            $table->float('tax_value')
                ->default(0);
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('t_ordergroup_id')
                ->references('id')
                ->on('t_ordergroup');
            $table->foreign('r_shop_menu_id')
                ->references('id')
                ->on('r_shop_menu');
            $table->index(['t_ordergroup_id']);
            $table->index(['r_shop_menu_id']);
        });
        DB::statement("ALTER TABLE `t_order` comment 'Order master data'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('t_order');
    }
}
