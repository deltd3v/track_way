import React, { useEffect, useState } from 'react';

import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import Markdown from 'react-native-markdown-display';

import QuizChoice from '../../components/QuizChoice';
import QuizProgressBar from '../../components/QuizProgressBar';
import TopicCustomBtn from '../../components/TopicCustomBtn';
import Colors from '../../constants/Colors';
import type { QuizChoiceT, QuizT } from '../../types/models.d';

const QuizScreen = () => {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [questions, setQuestions] = useState<QuizT[]>([]);
	const [currentQuestion, setCurrentQuestion] = useState<QuizT>({});
	const [choices, setChoices] = useState<QuizChoiceT[]>([]);
	const [passed, setPassed] = useState<boolean | undefined>();
	const [score, setScore] = useState(0);
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		import('../../data/quizes').then((m) => setQuestions(m.default));
	}, []);

	useEffect(() => {
		// reset state
		setCurrentQuestion(questions[currentQuestionIndex]);
		setPassed(undefined);
		setChoices([]);
		setProgress((currentQuestionIndex / questions.length) * 100);
	}, [questions, currentQuestionIndex]);

	return (
		<>
			<ScrollView contentContainerStyle={styles.container}>
				{!!currentQuestion && (
					<>
						<QuizProgressBar progress={progress} />

						{currentQuestion.imageUrl && (
							<Image
								resizeMode="contain"
								style={styles.image}
								source={{ uri: currentQuestion.imageUrl }}
							/>
						)}

						{!!currentQuestion.content && (
							<Markdown>{currentQuestion.content}</Markdown>
						)}

						<View style={styles.choicesContainer}>
							{currentQuestion.choices?.map((ch, i) => (
								<QuizChoice
									key={`i-${i}`}
									choice={ch}
									disabled={passed != undefined}
									onChoiceSelect={onChoiceSelect}
									selected={choices.includes(ch)}
								/>
							))}

							<TopicCustomBtn
								onPress={onSubmit}
								disabled={choices.length == 0}
								title="Check"
							></TopicCustomBtn>
						</View>
					</>
				)}
			</ScrollView>

			{passed !== undefined && passed && (
				<View
					style={[
						styles.feedBackBoxCommonStyles,
						styles.correctfeedBackContainer,
					]}
				>
					<Text
						style={[
							styles.feedBackTitleCommonStyles,
							styles.correctFeedBackTitle,
						]}
					>
						Correct !!
					</Text>
					<TopicCustomBtn
						onPress={onContinue}
						title="Continue"
					></TopicCustomBtn>
				</View>
			)}

			{passed !== undefined && !passed && (
				<View
					style={[
						styles.feedBackBoxCommonStyles,
						styles.inCorrectfeedBackContainer,
					]}
				>
					<Text
						style={[
							styles.feedBackTitleCommonStyles,
							styles.inCorrectFeedBackTitle,
						]}
					>
						Incorrect !!
					</Text>
					<TopicCustomBtn
						style={[
							styles.feedBackBtnCommonStyles,
							styles.feedBackIncorrectBtn,
						]}
						onPress={onContinue}
						title="Try again"
					></TopicCustomBtn>
				</View>
			)}
		</>
	);

	function onChoiceSelect(ch: QuizChoiceT) {
		setChoices((answers) =>
			answers.includes(ch)
				? answers.filter((c) => c !== ch)
				: currentQuestion.answers?.length! > 1
				? [...answers, ch]
				: [ch]
		);
	}

	function onSubmit() {
		function wasAnsweredCorrectly() {
			return choices.length !== currentQuestion.answers?.length
				? false
				: currentQuestion.answers.every((a) => choices.includes(a));
		}

		if (wasAnsweredCorrectly()) {
			setPassed(true);
			setScore((s) => s + 1);
			Alert.alert('✅ Correct !', `Wow, you really know your stuff 😏`);
			return;
		} else {
			setPassed(false);
			Alert.alert('❌ Incorrect !', 'The question was answered inncorrect !!');
			return;
		}
	}

	function onContinue() {
		setCurrentQuestionIndex((idx) => idx + 1);
		if (currentQuestionIndex === questions.length - 1) {
			// alert msg
			Alert.alert(
				'🏆 Quiz Complete !',
				`You scored ${score}/${questions.length} points !`
			);
		}
	}
};

export default QuizScreen;

const styles = StyleSheet.create({
	container: {
		padding: 10,
		// minHeight: '100%',
		flexGrow: 1,
		backgroundColor: Colors.light.white,
	},
	question: {
		fontSize: 20,
		fontWeight: '600',
		color: Colors.light.dark,
		marginVertical: 10,
	},
	image: {
		width: '100%',
		height: 300,
		minHeight: 300,
	},

	choicesContainer: {
		width: '100%',
		marginTop: 'auto',
	},
	btn: {
		padding: 10,
		borderRadius: 8,
		alignItems: 'center',
		color: Colors.light.white,
	},

	feedBackBoxCommonStyles: {
		left: 0,
		bottom: 0,
		width: '100%',
		position: 'absolute',
		padding: 16,
		borderWidth: 1.5,
		borderBottomWidth: 0,
		shadowRadius: 10,
		shadowOpacity: 7,
		elevation: 13,
		shadowOffset: {
			width: 0,
			height: 6,
		},
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15,
		shadowColor: Colors.light.dark,
		backgroundColor: Colors.light.background,
	},
	feedBackTitleCommonStyles: {
		fontSize: 20,
		fontWeight: 'bold',
		marginVertical: 10,
	},

	correctfeedBackContainer: {
		borderColor: Colors.light.primary,
		backgroundColor: Colors.light.bgSuccess,
	},

	correctFeedBackTitle: {
		color: Colors.light.primary,
	},
	inCorrectfeedBackContainer: {
		borderColor: Colors.light.secondary,
		backgroundColor: Colors.light.bgError,
	},
	inCorrectFeedBackTitle: {
		color: Colors.light.secondary,
	},
	feedBackBtnCommonStyles: {
		alignItems: 'center',
		paddingVertical: 10,
		borderRadius: 8,
	},
	feedBackCorrectBtn: {
		backgroundColor: Colors.light.primary,
	},
	feedBackIncorrectBtn: {
		backgroundColor: Colors.light.secondary,
	},
});
