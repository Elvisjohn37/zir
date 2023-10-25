<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use App\Exceptions\FormValidationException;

class BaseRequest extends FormRequest
{
	private function attachBailRule($rule)
	{
		if (is_array($rule)) {
			array_unshift($rule, 'bail');
			return $rule;
		} else {
			return 'bail|' . $rule;
		}
	}

	protected function bailAll($rules)
	{
		return array_map(function ($rule) {
			return $this->attachBailRule($rule);
		}, $rules);
	}

	public function defaultFailedValidation(Validator $validator)
	{
		parent::failedValidation($validator);
	}

	public function failedValidation(Validator $validator)
	{
		throw new FormValidationException($validator->errors());
	}

	public function authorize()
	{
		return true;
	}
}
