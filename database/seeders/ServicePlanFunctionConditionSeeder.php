<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MServicePlan;
use App\Models\MFunction;
use App\Models\MConditionType;
use App\Models\RFunctionCondition;
use App\Models\MServicePlanOption;
use App\Models\RServicePlanCondition;
use Illuminate\Support\Facades\Schema;

class ServicePlanFunctionConditionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Schema::disableForeignKeyConstraints();

        // Truncate older tables
        MServicePlan::truncate();
        RServicePlanCondition::truncate();

        // Truncate new tables
        MFunction::truncate();
        MConditionType::truncate();
        MServicePlanOption::truncate();
        RFunctionCondition::truncate();

        // Seeding MServicePlan
        $freePlan = MServicePlan::create([
            'hash_id' => makeHash() . 1,
            'name' => 'Gói miễn phí',
            'description' => 'Free plan',
            'price' => 0,
            'initial_price' => 0,
        ]);
        $lightPlan = MServicePlan::create([
            'hash_id' => makeHash() . 2,
            'name' => 'Gói trả phí',
            'description' => 'Light plan',
            'price' => 4500,
            'initial_price' => 0,
        ]);
        $extraPlan = MServicePlan::create([
            'hash_id' => makeHash() . 3,
            'name' => 'Gói cao cấp',
            'description' => 'Premium plan',
            'price' => 9500,
            'initial_price' => 1000,
        ]);

        // Seeding MFunction
        $qrFunction = MFunction::create([
            'name' => MFunction::FUNCTION_NAME_QR,
            'code' => MFunction::FUNCTION_CODE_QR,
            'object_type' => MFunction::OBJECT_TYPE_DATA,
            'object' => MFunction::OBJECT_ORDERGROUP,
        ]);

        $printerFunction = MFunction::create([
            'name' => MFunction::FUNCTION_NAME_PRINTER,
            'code' => MFunction::FUNCTION_CODE_PRINTER,
            'object_type' => MFunction::OBJECT_TYPE_PAGE,
            'object' => MFunction::OBJECT_PRINTER,
        ]);

        // Seeding MConditionType
        $usableType = MConditionType::create([
            'name' => MConditionType::TYPE_USABLE,
        ]);

        $maxValueType = MConditionType::create([
            'name' => MConditionType::TYPE_MAX_VALUE,
        ]);

        // Seeding RFunctionCondition
        // Free plan qr
        $freePlanQRCondition = RFunctionCondition::create([
            'm_function_id' => $qrFunction->id,
            'm_condition_type_id' => $maxValueType->id,
            'is_restricted' => false,
            'restricted_value' => 300,
        ]);

        // Light plan QR
        $lightPlanQRCondition = RFunctionCondition::create([
            'm_function_id' => $qrFunction->id,
            'm_condition_type_id' => $maxValueType->id,
            'is_restricted' => false,
            'restricted_value' => 1000,
        ]);

        // Light plan printer
        $lightPlanPrinterCondition = RFunctionCondition::create([
            'm_function_id' => $printerFunction->id,
            'm_condition_type_id' => $usableType->id,
            'is_restricted' => true,
            'restricted_value' => 0,
        ]);

        // Premium plan QR
        $extraPlanQRCondition = RFunctionCondition::create([
            'm_function_id' => $qrFunction->id,
            'm_condition_type_id' => $maxValueType->id,
            'is_restricted' => false,
            'restricted_value' => 0,
        ]);

        // Premium plan printer
        $extraPlanPrinterCondition = RFunctionCondition::create([
            'm_function_id' => $printerFunction->id,
            'm_condition_type_id' => $usableType->id,
            'is_restricted' => true,
            'restricted_value' => 0,
        ]);

        // Link service plan to function
        $freePlan->mFunctions()->attach(
            $qrFunction->id,
            [
                'additional_price' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        $lightPlan->mFunctions()->attach(
            $qrFunction->id,
            [
                'additional_price' => 10,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        $lightPlan->mFunctions()->attach(
            $printerFunction->id,
            [
                'additional_price' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        $extraPlan->mFunctions()->attach(
            $qrFunction->id,
            [
                'additional_price' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        $extraPlan->mFunctions()->attach(
            $printerFunction->id,
            [
                'additional_price' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // Link service plan to function condition
        $freePlan->rFunctionConditions()->attach(
            $freePlanQRCondition->id,
            [
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        $lightPlan->rFunctionConditions()->attach(
            $lightPlanQRCondition->id,
            [
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        $lightPlan->rFunctionConditions()->attach(
            $lightPlanPrinterCondition->id,
            [
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        $extraPlan->rFunctionConditions()->attach(
            $extraPlanQRCondition->id,
            [
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        $extraPlan->rFunctionConditions()->attach(
            $extraPlanPrinterCondition->id,
            [
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        Schema::enableForeignKeyConstraints();
    }
}
