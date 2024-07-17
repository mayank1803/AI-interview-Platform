import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

const QuestionsPage = () => {
  const faqs = [
    {
      question: 'What types of interviews can I practice?',
      answer: 'You can practice interviews for various roles including Software Engineer, Data Scientist, and Product Manager.',
    },
    {
      question: 'How do I get feedback on my answers?',
      answer: 'Our AI evaluates your responses and provides detailed feedback, including a rating and suggestions for improvement.',
    },
    {
      question: 'Can I retake interviews?',
      answer: 'Yes, you can retake interviews to practice again and improve your skills. Your progress will be tracked in the dashboard.',
    },
    {
      question: 'Is there a free trial available?',
      answer: 'Yes, we offer a free trial period. You can explore the features and decide if you want to continue with a subscription.',
    },
    {
      question: 'How do I create a new interview?',
      answer: 'After logging in, go to the “Create New Interview” section in your dashboard, select your role, and customize the interview based on your preferences.',
    },
    {
      question: 'How do I track my interview progress?',
      answer: 'You can view your interview history, track progress, and see feedback in the “My Interviews” section of your dashboard.',
    },
  ];

  return (
    <div className="px-4 py-12 mx-auto max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-gray-600">
          Find answers to the most common questions about our platform. If you have more questions, feel free to reach out to us!
        </p>
      </div>

      {/* FAQ Section */}
      <div className="space-y-8">
        {faqs.map((faq, index) => (
          <div key={index} className="p-6 bg-white rounded-lg shadow-md border border-gray-200 flex items-start hover:shadow-xl transition-shadow duration-300">
            <QuestionMarkCircleIcon className="w-8 h-8 text-blue-600 mr-4" />
            <div>
              <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
              <p className="text-gray-700">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Info */}
      <div className="mt-12 text-center">
        <p className="text-lg text-gray-600 mb-4">
          Didn’t find what you were looking for? <br />
          Contact us at <a href="mailto:support@aiinterviewmocker.com" className="text-blue-600 hover:underline">support@aiinterviewmocker.com</a>
        </p>
      </div>
    </div>
  );
};

export default QuestionsPage;
