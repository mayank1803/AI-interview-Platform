import { SignUp } from "@clerk/nextjs";


export default function Page() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
      <div className="absolute inset-0">
        <img
          alt="Job Interview Setting"
          src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gray-900 bg-opacity-60"></div>
      </div>
      <div className="relative z-10 text-center text-white px-4">
        <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl mb-6">
          Welcome to Your AI Interview Platform
        </h2>
        <p className="text-lg sm:text-xl md:text-2xl mb-8">
          Prepare for your next big opportunity with our advanced AI-powered interview simulations. Gain insights, feedback, and ace your interviews with confidence.
        </p>
        <div className="flex justify-center items-center">
          <SignUp
            appearance={{
              variables: {
                colorPrimary: '#3B82F6', // Primary button color
                colorTextPrimary: '#FFFFFF', // Text color
                colorTextSecondary: '#E5E7EB', // Secondary text color (light gray)
                colorBackground: 'rgba(255, 255, 255, 0.1)', // Semi-transparent background color
                colorBackgroundButton: '#1D4ED8', // Background color for buttons
                colorBackgroundButtonHover: '#2563EB', // Button hover color
                borderColor: 'rgba(255, 255, 255, 0.3)', // Border color
                colorTextLink: '#9CA3AF', // Color of the "Don’t have an account?" link
                colorTextClerkLogo: '#E5E7EB', // Color of the Clerk logo
                colorBackgroundFooter: 'rgba(255, 255, 255, 0.2)', // Semi-transparent background color for footer
                colorTextFooter: '#E5E7EB', // Text color for the footer
              },
              elements: {
                form: 'rounded-md shadow-lg border border-gray-300 p-4 bg-white bg-opacity-30',
                button: 'py-2 px-4 rounded-md border border-transparent font-semibold text-white bg-[#1D4ED8] hover:bg-[#2563EB]',
                input: 'bg-transparent text-white border border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md relative', // Styling for input fields
                label: 'text-gray-300',
                error: 'text-red-500',
                footer: 'text-gray-300 bg-opacity-20 mt-4 p-2 rounded-md border border-gray-400', // Semi-transparent white background with border for footer
                icon: 'text-gray-300',
                eyeIcon: 'absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300',
                a: 'text-[#9CA3AF] hover:text-[#6B7280]' // Styles for the "Don’t have an account?" link
              },
            }}
            fallbackRedirectUrl="/dashboard"
          />
        </div>
      </div>
    </section>
  );
}
