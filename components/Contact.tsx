import React, { useState } from 'react';
import { ContactFormState } from '../types';
import { Button } from './Button';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

export const Contact: React.FC = () => {
  const [formState, setFormState] = useState<ContactFormState>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    // Simulate Python Backend Interaction
    // In a real app: await fetch('/api/contact', { method: 'POST', body: JSON.stringify(formState) })
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Form submitted to backend:", formState);
      setStatus('success');
      setFormState({ name: '', email: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Get in Touch</h2>
        <p className="text-slate-600">
          Interested in booking a session or purchasing a print? Fill out the form below.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        {status === 'success' ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Message Sent!</h3>
            <p className="text-slate-500">Thank you for reaching out. I'll get back to you shortly via email.</p>
            <Button className="mt-8" onClick={() => setStatus('idle')} variant="outline">
              Send Another
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formState.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border-slate-300 border px-4 py-2.5 focus:ring-slate-900 focus:border-slate-900 transition-shadow"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={formState.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border-slate-300 border px-4 py-2.5 focus:ring-slate-900 focus:border-slate-900 transition-shadow"
                  placeholder="jane@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
              <select
                name="subject"
                id="subject"
                required
                value={formState.subject}
                onChange={handleChange}
                className="w-full rounded-lg border-slate-300 border px-4 py-2.5 focus:ring-slate-900 focus:border-slate-900 transition-shadow"
              >
                <option value="" disabled>Select a topic</option>
                <option value="Portrait Session">Portrait Session Inquiry</option>
                <option value="Event Coverage">Event Coverage</option>
                <option value="Print Purchase">Print Purchase</option>
                <option value="Collaboration">Collaboration</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Message</label>
              <textarea
                name="message"
                id="message"
                required
                rows={5}
                value={formState.message}
                onChange={handleChange}
                className="w-full rounded-lg border-slate-300 border px-4 py-2.5 focus:ring-slate-900 focus:border-slate-900 transition-shadow resize-y"
                placeholder="Tell me about your project or idea..."
              />
            </div>

            {status === 'error' && (
               <div className="rounded-md bg-red-50 p-4 flex items-center gap-3 text-red-700 text-sm">
                 <AlertCircle className="w-5 h-5" />
                 Something went wrong. Please try again later.
               </div>
            )}

            <div className="pt-2">
              <Button type="submit" className="w-full md:w-auto" isLoading={status === 'submitting'}>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};