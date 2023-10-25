<?php

namespace App\Http\Requests;

use App\Exceptions\UnauthorizedException;
use Config;
use Illuminate\Contracts\Validation\Validator;
use App\Http\Services\MobileSiteService;

class LoginReq extends BaseRequest
{
	public function __construct()
	{
		$this->redirect = Config::get('custom.login.routeOnFail');
		return parent::__construct();
	}

	/**
	 * reset failedValidation action to original
	 * redirect instead of throw error
	 */
	public function failedValidation(Validator $validator)
	{
		throw new UnauthorizedException('Login parameter invalid');
	}

	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array
	 */
	public function rules()
	{
		$mobileSiteService = new MobileSiteService();

		if ($mobileSiteService->isMobileSite()) {
			$datas = [
				'id' => 'required',
				'lang' => 'required',
			];
		} else {
			$datas = [
				'token' => 'required',
				'language' => 'required',
			];
		}

		return $this->bailAll($datas);
	}
}
