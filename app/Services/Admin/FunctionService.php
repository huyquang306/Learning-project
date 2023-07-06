<?php

namespace App\Services\Admin;

use App\Repositories\Interfaces\FunctionRepositoryInterface as FunctionRepository;

class FunctionService
{
    protected $functionRepository;

    /**
     * FunctionService constructor.
     *
     * @param FunctionRepository $functionRepository
     */
    public function __construct(FunctionRepository $functionRepository)
    {
        $this->functionRepository = $functionRepository;
    }

    /**
     * Get all functions
     *
     * @return mixed
     */
    public function getFunctions()
    {
        return $this->functionRepository->getFunctionDataAdmin();
    }
}
