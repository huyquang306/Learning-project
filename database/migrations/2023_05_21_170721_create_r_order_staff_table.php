<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateROrderStaffTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('r_order_staff', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('t_order_id')
                ->nullable(false);
            $table->unsignedBigInteger('m_staff_id')
                ->nullable(false);
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('t_order_id')
                ->references('id')
                ->on('t_order');
            $table->foreign('m_staff_id')
                ->references('id')
                ->on('m_staff');
            $table->index(['t_order_id', 'm_staff_id']);
            $table->index(['t_order_id']);
            $table->index(['m_staff_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('r_order_staff');
    }
}
