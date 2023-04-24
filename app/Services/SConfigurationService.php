<?php

namespace App\Services;

use App\Repositories\Interfaces\SConfigurationRepositoryInterface as SConfigurationRepository;
use stdClass;

class SConfigurationService
{
    protected $sConfigurationRepository;

    /**
     * SConfigurationService constructor.
     * @param SConfigurationRepository $sConfigurationRepository
     */
    public function __construct(SConfigurationRepository $sConfigurationRepository)
    {
        $this->sConfigurationRepository = $sConfigurationRepository;
    }

    /**
     * get configurations
     *
     * @param  ?string $key
     * @return stdClass
     */
    public function getList(string $key = null): stdClass
    {
        return $this->sConfigurationRepository->getConfigurations($key);
    }
}