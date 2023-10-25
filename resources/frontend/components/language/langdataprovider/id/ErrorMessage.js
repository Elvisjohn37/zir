import React from 'react';
import NestedIntlProvider from 'frontend/components/NestedIntlProvider';

const MESSAGES = {
	'-1': {
		title: 'Error',
		message: 'Something went wrong connecting to server',
	},
	'-2': {
		title: 'Session Time Out',
		message: 'Your session has been expired. Please re-login to continue.',
	},
	ERR_00001: {
		title: 'Error',
		message: 'Something went wrong',
	},
	ERR_00002: {
		title: 'Error',
		message: 'This field is required',
	},
	ERR_00003: {
		title: 'Error',
		message: 'This field requires name format',
	},
	ERR_00004: {
		title: 'Error',
		message: 'This field requires at least 4 letters',
	},
	ERR_00005: {
		title: 'Error',
		message: 'Confirm password and password must the same',
	},
	ERR_00006: {
		title: 'Error',
		message: 'This field requires alphabet and numeric only',
	},
	ERR_00007: {
		title: 'Error',
		message: 'At least 4 characters',
	},
	ERR_00008: {
		title: 'Error',
		message: 'At least 6 characters',
	},
	ERR_00009: {
		title: 'Error',
		message: 'Action not allowed, please reload the page.',
	},
	ERR_00010: {
		title: 'Error',
		message: 'This field requires mobile number format',
	},
	ERR_00011: {
		title: 'Error',
		message: 'This field requires email format',
	},
	ERR_00012: {
		title: 'Error',
		message: 'This field requires date format',
	},
	ERR_00013: {
		title: 'Game Maintenance Mode',
		message: 'This game is currently under maintenance. Please try again later.',
	},
	ERR_00014: {
		title: 'Game Restrictions',
		message: 'You are currently excluded from playing the games and making deposits.',
	},
	ERR_00015: {
		title: 'Error',
		message: '',
	},
	ERR_00016: {
		title: 'Error',
		message: 'No Image Available',
	},
	ERR_00017: {
		title: 'Incomplete Game',
		message:
			'You have running game {runningGameName} at your desktop device. Do you want to settle that transaction and continue on this device?',
	},
	ERR_00018: {
		title: 'Incomplete Game',
		message:
			'You have running game {runningGameName} at your mobile device. Do you want to settle that transaction and continue on this device?',
	},
	ERR_00021: {
		title: 'Error',
		message: 'Invalid field format, please check the supplied informations.',
	},
	ERR_00022: {
		title: 'Error',
		message: 'Invalid field value, please check the supplied informations.',
	},
	ERR_00023: {
		title: 'Error',
		message: 'Invalid request, please check the supplied informations.',
	},
	ERR_00024: {
		title: 'Error',
		message: 'Invalid username or password',
	},
	ERR_00025: {
		title: 'Page Not Found',
		message: 'The requested url does not exist.',
	},
	ERR_00026: {
		title: 'Access Denied',
		message: "Invalid credentials or you don't have access to this page.",
	},
	ERR_00027: {
		title: 'Incomplete Game',
		message: 'You have running game {runningGameName}. Please finish it first before playing another game.',
	},
	ERR_00028: {
		title: 'Account {clientStatus}',
		message: 'You are currently excluded from playing the games and making deposits.',
	},
	ERR_00029: {
		title: 'Website Under Maintenance',
		message: 'SBO Casino is currently under maintenance. Please try again later.',
	},
	ERR_00030: {
		title: 'Error',
		message: 'No Record Found',
	},
	ERR_00031: {
		title: 'Error',
		message: 'Unable to fetch player balance',
	},
	ERR_00032: {
		title: 'Game rule not found',
		message: 'Game rule under contruction or does not exist. Please contact system administrator.',
	},
	ERR_00033: {
		title: 'Error',
		message: 'This field requires a whole number.',
	},
	ERR_00034: {
		title: 'Error',
		message: 'This currency has no access to Classic Games. Please contact our customer support.',
	},
	ERR_00035: {
		title: 'Error',
		message: 'No Game Found',
	},
};

export default function Provider({ children, ...props }) {
	return (
		<NestedIntlProvider {...props} messages={MESSAGES}>
			{children}
		</NestedIntlProvider>
	);
}
