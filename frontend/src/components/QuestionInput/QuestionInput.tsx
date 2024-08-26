import { useState } from 'react'
import { Stack, TextField } from '@fluentui/react'
import { SendRegular } from '@fluentui/react-icons'
import { ThumbLikeFilled, ThumbLikeRegular, ThumbDislikeFilled, ThumbDislikeRegular } from '@fluentui/react-icons'; // Check actual imports based on your icons library
import { FeedbackSubmission } from '../../api';

import Send from '../../assets/Send.svg'

import styles from './QuestionInput.module.css'

interface Props {
  onSend: (question: string, id?: string) => void
  onFeedbackSubmit: (feedback: FeedbackSubmission) => void
  disabled: boolean
  placeholder?: string
  clearOnSend?: boolean
  conversationId?: string
}

export const QuestionInput = ({ onSend, onFeedbackSubmit, disabled, placeholder, clearOnSend, conversationId }: Props) => {
  const [question, setQuestion] = useState<string>('')
  const [feedbackType, setFeedbackType] = useState<null | 'positive' | 'negative'>(null);
  const [isFeedbackMode, setIsFeedbackMode] = useState(false);
  const [inputPlaceholder, setInputPlaceholder] = useState(placeholder); // Initial placeholder from props

  const sendQuestion = () => {
    if (disabled || !question.trim()) {
      return;
    }
  
    if (isFeedbackMode) {
      const isPositiveFeedback = feedbackType === 'positive';
      const feedback = { isPositive: isPositiveFeedback, additionalInfo: question };
      onFeedbackSubmit(feedback);
      // submitConversationFeedback(feedback); // Ensure proper error handling and promise management
      setIsFeedbackMode(false);
      setFeedbackType(null);
      setInputPlaceholder(placeholder); // Reset placeholder
    } else {
      // Standard message send logic
      onSend(question, conversationId);
    }
  
    if (clearOnSend) {
      setQuestion('');
    }
  };

  const onEnterPress = (ev: React.KeyboardEvent<Element>) => {
    if (ev.key === 'Enter' && !ev.shiftKey && !(ev.nativeEvent?.isComposing === true)) {
      ev.preventDefault()
      sendQuestion()
    }
  }

  const onQuestionChange = (_ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    setQuestion(newValue || '')
  }

  const sendQuestionDisabled = disabled || !question.trim()

  return (
    <Stack className={styles.questionInputContainer}>
      <div className={styles.textFieldDiv}>
        <TextField
          className={styles.questionInputTextArea}
          placeholder={inputPlaceholder}
          multiline
          resizable={false}
          borderless
          value={question}
          onChange={onQuestionChange}
          onKeyDown={onEnterPress}
        />
      </div>
      <div className={styles.controlsContainer}>
        <div className={styles.feedbackButtons}>
          <div
            aria-label="Thumbs Up"
            className={feedbackType === 'positive' ? `${styles.activeButton} ${styles.thumbsUpButton}` : styles.thumbsUpButton}
            onClick={() => {
              if (feedbackType === 'positive') {
                setFeedbackType(null);
                setIsFeedbackMode(false);
                setInputPlaceholder("Type a new question...");
                setQuestion('')
              } else {
                setFeedbackType('positive');
                setIsFeedbackMode(true);
                setInputPlaceholder('Type your feedback...');
                setQuestion('')
              }
            }}
          >
            {feedbackType === 'positive' ? <ThumbLikeFilled /> : <ThumbLikeRegular />}
          </div>
          <div
            aria-label="Thumbs Down"
            className={feedbackType === 'negative' ? `${styles.activeButton} ${styles.thumbsDownButton}` : styles.thumbsDownButton}
            onClick={() => {
              if (feedbackType === 'negative') {
                setFeedbackType(null);
                setIsFeedbackMode(false);
                setInputPlaceholder('Type a new question...');
                setQuestion('')
              } else {
                setFeedbackType('negative');
                setIsFeedbackMode(true);
                setInputPlaceholder('Type your feedback...');
                setQuestion('')
              }
            }}
          >
            {feedbackType === 'negative' ? <ThumbDislikeFilled /> : <ThumbDislikeRegular />}
          </div>
        </div>
        <div
          className={styles.questionInputSendButtonContainer}
          aria-label="Ask question button"
          onClick={sendQuestion}
          onKeyDown={e => (e.key === 'Enter' || e.key === ' ' ? sendQuestion() : null)}
        >
          {sendQuestionDisabled ? (
            <SendRegular className={styles.questionInputSendButtonDisabled} />
          ) : (
            <img src={Send} className={styles.questionInputSendButton} alt="Send Button" />
          )}
        </div>
      </div>
      <div className={styles.questionInputBottomBorder} />
    </Stack>
  );
  
  
}
