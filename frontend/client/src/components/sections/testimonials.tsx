import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Marketing Specialist",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    content:
      "After 3 months of sending applications without any responses, I used ResumeAI to optimize my resume. Within 2 weeks, I landed 4 interviews and received a great job offer!",
    improvement: "Sarah improved her ATS score from 42% to 91%",
  },
  {
    name: "David Chen",
    role: "Software Engineer",
    image: "https://randomuser.me/api/portraits/men/46.jpg",
    rating: 5,
    content:
      "I was struggling to get past the ATS systems at tech companies. ResumeAI helped me identify the right keywords for my target roles and format my resume properly. Now I'm working at my dream company!",
    improvement: "David improved his ATS score from 51% to 94%",
  },
  {
    name: "Emily Rodriguez",
    role: "Project Manager",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    rating: 5,
    content:
      "The Professional plan was a game-changer for me. The expert review helped me completely transform my resume, and the LinkedIn optimization helped me get noticed by recruiters. Worth every penny!",
    improvement: "Emily improved her ATS score from 39% to 88%",
  },
  {
    name: "Michael Taylor",
    role: "Financial Analyst",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    content:
      "As someone switching careers, I needed help showcasing my transferable skills. ResumeAI guided me to highlight my relevant experience and helped me land interviews in my new field.",
    improvement: "Michael improved his ATS score from 37% to 85%",
  },
  {
    name: "Jennifer Lee",
    role: "UX Designer",
    image: "https://randomuser.me/api/portraits/women/54.jpg",
    rating: 5,
    content:
      "The keyword optimization feature is fantastic! It helped me tailor my resume for each design role I applied to, and I started getting callbacks almost immediately after using it.",
    improvement: "Jennifer improved her ATS score from 45% to 92%",
  },
];

export default function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);
  const [maxSlide, setMaxSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateSlidesPerView = () => {
      if (window.innerWidth >= 1024) {
        setSlidesPerView(3);
      } else if (window.innerWidth >= 768) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(1);
      }
    };

    updateSlidesPerView();
    window.addEventListener("resize", updateSlidesPerView);

    return () => {
      window.removeEventListener("resize", updateSlidesPerView);
    };
  }, []);

  useEffect(() => {
    setMaxSlide(Math.max(0, testimonials.length - slidesPerView));
  }, [slidesPerView]);

  const goToSlide = (index: number) => {
    const newIndex = Math.max(0, Math.min(index, maxSlide));
    setCurrentSlide(newIndex);
    
    if (carouselRef.current) {
      const slideWidth = 100 / slidesPerView;
      carouselRef.current.style.transform = `translateX(-${newIndex * slideWidth}%)`;
    }
  };

  return (
    <section id="testimonials" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Success Stories from Our Users</h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            See how ResumeAI has helped job seekers land their dream roles
          </p>
        </div>

        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-md"
            onClick={() => goToSlide(currentSlide - 1)}
            disabled={currentSlide === 0}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Previous</span>
          </Button>

          <div className="overflow-hidden">
            <div
              ref={carouselRef}
              className="flex transition-transform duration-300 ease-out"
              style={{ transform: "translateX(0)" }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-4`}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 h-full">
                    <div className="flex items-center mb-4">
                      <div className="flex-shrink-0">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-semibold dark:text-white">{testimonial.name}</h4>
                        <p className="text-gray-600 dark:text-gray-300">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-200 mb-4">{testimonial.content}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">{testimonial.improvement}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-md"
            onClick={() => goToSlide(currentSlide + 1)}
            disabled={currentSlide >= maxSlide}
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Next</span>
          </Button>
        </div>

        <div className="flex justify-center mt-6">
          {[...Array(maxSlide + 1)].map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full mx-1",
                currentSlide === index ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
              )}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
