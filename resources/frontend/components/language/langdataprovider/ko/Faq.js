import React from 'react';
import NestedIntlProvider from 'frontend/components/NestedIntlProvider';

const MESSAGES = {
	faq: 'Frequently Asked Questions',
	faq1: {
		question: 'What happens if my Internet connection fails or my computer goes down during a game?',
		answer: 'SBOBET Casino software monitors game play at every step of the game. When the Internet connection is restored or the computer restarted and the player logs back into the SBOBET Casino site, the game will appear at the exact stage that the interruption occurred to allow completion except for \'Live Casino\' games. Since the \'Live Casino\' games are streamed in real time, once players have confirmed their bets, it is straight taken into their account regardless of the connection failure. The result of the game can still be viewed from the \'Report\' section in the \'Account\' menu link.'
	},
	faq2: {
		question: 'I have a complaint, who do I contact?',
		answer: 'In the case of a complaint, please email SBOBET Casino and to help resolve the complaint as quickly as possible, please include as much information as possible. SBOBET Casino undertakes to investigate and resolve complaints as quickly as possible.'
	},
	faq3: {
		question: 'How can I be sure that the games are fair and truly represent the \'real casino\' games?',
		answer: 'SBOBET Casino software was tested and certified to the Treasury standards by one of the world\'s foremost gaming laboratories, who check all aspects of the casino operation. Not only is the Random Number Generator checked but all aspects of the software, hardware and operations.'
	},
	faq4: {
		question: 'How do I start playing?',
		answer: 'To start playing, you must signup an account. On sign up completion, you may proceed to the login page and login using the credentials that you created during your signup. Once you are inside, you can choose which game to participate without installing an application on your system.'
	},
	faq5: {
		question: 'What are the computer and software requirements to play?',
		answer: 'The requirements to play are:' +
		'PIII-800 and above' + 
		'Internet Explorer 6.0 or Firefox browser' + 
		'Adobe Flash Player 8.0 and above' + 
		'Stable internet connection(broadband preferred)' + 
		'Minimum screen resolution: 1024 x 768.'
	},
	faq6: {
		question: 'How are the results of the games determined?',
		answer: 'The system uses a \'RNG\' or \'Random Number Generator\' which guarantees completely random results in every game. As for \'Live Casino\', the game results is determined by the card results on the table and it will be scanned into the system as the cards being drawn from the table.'
	},
	faq7: {
		question: 'Is the User and Password case sensitive?',
		answer: 'Yes'
	},
	faq8: {
		question: 'I forgot my password, what should I do?',
		answer: 'Click on the \'lost password\' icon and fill out the resulting form and submit the form, this allows the casino to register your new password and send you a once only account activation password.'
	},
	faq9: {
		question: 'My internet connection sometimes drops out, is there anything I can do?',
		answer: 'The most common reason for this is having call waiting activated. Contact your telephone company for details on how to deactivate this feature.'
	},
	faq10: {
		question: 'How can I find out more about the games?',
		answer: 'While in the game that is of interest, select the \'Rules\' icon which will open and contains the game rules and pay schedules.'
	},
	faq11: {
		question: 'I thought I won a couple of games ago but I wasn\'t paid for it, is there any way of checking what the result was and whether I was paid?',
		answer: 'Players may see their game history by clicking on the \'lobby\' button and then selecting the \'account\' button, then the \'reports\' button. Players enter the date and time of the game/s in question and the system produces a report. This report may also be printed. To interpret the results the player may need to go back into the game rules of the specific game where all the necessary information is located.'
	},
	faq12: {
		question: 'How do I change my details?',
		answer: "Players are able to change their details by logging into the casino, then selecting the 'Account' menu link, then selecting the 'User Info' link, and making the appropriate changes."
	},
	faq13: {
		question: 'Can I get a listing of my financial transactions with the SBOBET Casino site?',
		answer: 'Players will be sent a copy of all transactions within a designated time frame by sending the request.'
	},
	showAll: 'Show All'
};

export default function Provider({ children, ...props }) {
	return (
		<NestedIntlProvider {...props} messages={MESSAGES}>
			{children}
		</NestedIntlProvider>
	);
}
