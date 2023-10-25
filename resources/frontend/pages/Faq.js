import React from 'react';
import { LangDataProvider } from 'frontend/components/Language';
import styles from './Faq.module';
import Button from '@mui/material/Button';
import { range } from 'lodash';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function Faq() {

	const FAQ_LENGTH = 13;
	let [activeFaqs, setActiveFaqs] = React.useState({});
	let [isShowAll, setIsShowAll] = React.useState(false);

	React.useEffect(() => {
		let tempActiveFaqs = {};
		range(FAQ_LENGTH).forEach(item => {
			tempActiveFaqs = {...tempActiveFaqs, [item]: isShowAll };
		});
		setActiveFaqs(tempActiveFaqs);
	}, [isShowAll == true]);

	React.useEffect(() => {
		let countActiveFaq = 0;
		activeFaqs && range(FAQ_LENGTH).forEach(item => {
			activeFaqs[item] && countActiveFaq++;
		});
		(countActiveFaq == FAQ_LENGTH) && setIsShowAll(true);
	}, [activeFaqs]);

	return (
		<LangDataProvider category="faq" className="testGamingRules">
			<div className={styles.faq}>
				<h3>
					<FormattedMessage id="faq" />
				</h3>
				<FormControlLabel 
					label={<FormattedMessage id="showAll" />}
					className={styles.showAll}
					control={
						<Checkbox 
							inputProps={{ 'aria-label': 'Checkbox demo' }}
							checked={isShowAll}
							onChange={() => setIsShowAll(!isShowAll)}
							color="secondary"
						/>
					} 
				/>
				<div className={styles.questionsContainer}>
					<ol>
						{
							range(FAQ_LENGTH).map(item => (
								<li 
									key={item}
									className={styles.question}
								>
									<Button
										classes={{ root: styles.link }}
										size="small"
										href="#"
										color="secondary"
										onClick={ () => setActiveFaqs({ ...activeFaqs, [item] : !activeFaqs[item] }) }
										className={activeFaqs[item] ? styles.active : ''}
									>
										<FormattedMessage id={`faq${item + 1}.question`} />
									</Button>
									{
										<div 
											className={
												classnames([
													styles.answer, 
													activeFaqs && activeFaqs[item] ? styles.show : styles.hide
												])
											}
										>
												<div className={styles.answerContent} >
													<FormattedMessage 
														id={`faq${item + 1}.answer`} 
													/>
												</div>
										</div>
									}
								</li>
							))
						}
					</ol>
				</div>
			</div>
		</LangDataProvider>
	);
}
