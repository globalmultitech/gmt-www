import { ArrowRight, CheckCircle, Quote, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HeroSlider } from '@/components/hero-slider';
import { ServiceCard } from '@/components/service-card';
import { TestimonialCarousel } from '@/components/testimonial-carousel';

const services = [
  {
    icon: '💻',
    title: 'IT-Management',
    description: 'We provide to you the best choices for you. Adjust it to your needs and make sure you undergo.',
    href: '/layanan',
  },
  {
    icon: '📊',
    title: 'Data Security',
    description: 'We provide to you the best choices for you. Adjust it to your needs and make sure you undergo.',
    href: '/layanan',
  },
  {
    icon: '📈',
    title: 'Business Reform',
    description: 'We provide to you the best choices for you. Adjust it to your needs and make sure you undergo.',
    href: '/layanan',
  },
  {
    icon: '🚀',
    title: 'Infrastructure',
    description: 'We provide to you the best choices for you. Adjust it to your needs and make sure you undergo.',
    href: '/layanan',
  },
];

const projects = [
    {
        image: 'https://placehold.co/600x400.png',
        aiHint: 'data analytics dashboard',
        category: 'Data Security',
        title: 'Network Security',
    },
    {
        image: 'https://placehold.co/600x400.png',
        aiHint: 'cloud infrastructure diagram',
        category: 'Cloud',
        title: 'Cloud Integration',
    },
    {
        image: 'https://placehold.co/600x400.png',
        aiHint: 'mobile app interface',
        category: 'Development',
        title: 'App Development',
    },
];

const blogPosts = [
    {
        image: 'https://placehold.co/600x400.png',
        aiHint: 'server room',
        date: 'July 10, 2024',
        author: 'Admin',
        title: 'Technology that is powering the digital world',
    },
    {
        image: 'https://placehold.co/600x400.png',
        aiHint: 'cyber security lock',
        date: 'July 11, 2024',
        author: 'Admin',
        title: 'The role of AI in transforming industries',
    },
    {
        image: 'https://placehold.co/600x400.png',
        aiHint: 'team collaboration meeting',
        date: 'July 12, 2024',
        author: 'Admin',
        title: 'How to choose the right IT solutions provider',
    },
];

export default function Home() {
  return (
    <div className="flex flex-col bg-background text-foreground">
      <HeroSlider />
      
      {/* About Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <Image 
                src="https://placehold.co/600x400.png"
                alt="About Daltech"
                width={570}
                height={625}
                className="rounded-lg shadow-lg"
                data-ai-hint="team work office"
              />
              <div className="absolute -bottom-8 -right-8 bg-primary text-primary-foreground p-8 rounded-lg w-64 shadow-xl">
                <h3 className="text-5xl font-extrabold font-headline">25+</h3>
                <p className="mt-2 font-semibold">Years Of Experience in IT Solution</p>
              </div>
            </div>
            <div>
              <p className="font-semibold text-primary uppercase tracking-widest mb-2">About Daltech</p>
              <h2 className="text-4xl md:text-5xl font-headline font-extrabold mb-6">We are the best <span className="text-primary">IT solution</span></h2>
              <p className="text-muted-foreground mb-6">We are a passionate team of software engineers, designers, and strategists who are committed to helping businesses of all sizes succeed in the digital world. We believe that technology can be a powerful tool for good, and we are dedicated to using our skills and expertise to make a positive impact.</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                  <span className="font-semibold">Bespoke software solutions</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                  <span className="font-semibold">Human-centered design</span>
                </li>
                 <li className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                  <span className="font-semibold">Cloud-native architecture</span>
                </li>
              </ul>
              <Button asChild size="lg">
                <Link href="/tentang-kami">Discover More <ArrowRight className="ml-2 h-5 w-5"/></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 md:py-28 bg-secondary">
        <div className="container mx-auto px-4 text-center">
           <p className="font-semibold text-primary uppercase tracking-widest mb-2">Our Services</p>
           <h2 className="text-4xl md:text-5xl font-headline font-extrabold mb-16">What we do</h2>
           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
                <ServiceCard key={index} {...service} />
            ))}
           </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                  <p className="font-semibold text-primary uppercase tracking-widest mb-2">Recent Projects</p>
                  <h2 className="text-4xl md:text-5xl font-headline font-extrabold">Our latest case studies</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                  {projects.map((project, index) => (
                      <div key={index} className="group relative overflow-hidden rounded-lg">
                          <Image src={project.image} alt={project.title} width={400} height={400} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" data-ai-hint={project.aiHint}/>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                          <div className="absolute bottom-0 left-0 p-6 text-white">
                              <p className="text-primary font-semibold text-sm">{project.category}</p>
                              <h3 className="text-2xl font-bold font-headline mt-1">{project.title}</h3>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 md:py-28 bg-secondary">
        <div className="container mx-auto px-4">
           <TestimonialCarousel />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center py-16">
            <h2 className="text-3xl md:text-4xl font-headline font-extrabold mb-4 md:mb-0">Become a part of the Daltech success story</h2>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link href="/hubungi-kami">Get a Free Quote</Link>
            </Button>
          </div>
        </div>
      </section>

       {/* Blog Section */}
      <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                  <p className="font-semibold text-primary uppercase tracking-widest mb-2">Our Blog</p>
                  <h2 className="text-4xl md:text-5xl font-headline font-extrabold">Latest news & articles</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                  {blogPosts.map((post, index) => (
                      <div key={index} className="group">
                           <div className="relative overflow-hidden rounded-lg mb-6">
                            <Image src={post.image} alt={post.title} width={400} height={250} className="w-full object-cover transition-transform duration-500 group-hover:scale-110" data-ai-hint={post.aiHint}/>
                           </div>
                           <div className="text-sm text-muted-foreground mb-2">
                               <span>{post.date}</span> / <span>By {post.author}</span>
                           </div>
                           <h3 className="text-xl font-bold font-headline mb-4 group-hover:text-primary transition-colors">
                               <Link href="/resources">{post.title}</Link>
                           </h3>
                           <Link href="/resources" className="font-semibold text-primary flex items-center gap-2">
                                Read More <ArrowRight className="h-4 w-4" />
                           </Link>
                      </div>
                  ))}
              </div>
          </div>
      </section>
    </div>
  );
}
