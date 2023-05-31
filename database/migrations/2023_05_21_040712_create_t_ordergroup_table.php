<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTOrdergroupTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('t_ordergroup', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('m_shop_id')
                ->nullable(false);
            $table->string('hash_id', 16);
            $table->decimal('status', 1, 0)
                ->default(0);
            $table->boolean('order_blocked')
                ->default(true);
            $table->integer('count')
                ->default(1);
            $table->float('total_billing')
                ->default(0);
            $table->string('file_path', 255)
                ->nullable();
            $table->unsignedInteger('number_of_customers')
                ->nullable(false)
                ->default(1);
            $table->date('published_at')
                ->nullable();
            $table->timestamp('payment_request_time')
                ->nullable();
            $table->unsignedBigInteger('modified_by')
                ->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('m_shop_id')
                ->references('id')
                ->on('m_shop');
            $table->unique('hash_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('t_ordergroup');
    }
}
