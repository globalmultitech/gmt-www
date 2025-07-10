import { ArrowRight, CheckCircle, Quote, Star, Users, ShieldCheck, TrendingUp, Handshake, Briefcase, Cpu, Code2, Headphones, MonitorSmartphone, BarChart, Medal, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ServiceCard } from '@/components/service-card';
import { TestimonialCarousel } from '@/components/testimonial-carousel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const featureCards = [
    {
        icon: <MonitorSmartphone className="h-10 w-10 text-primary" />,
        title: 'Smart softwares',
        description: 'Duis aute irure dolor in repreherita ineto.',
    },
    {
        icon: <BarChart className="h-10 w-10 text-primary" />,
        title: 'Trusted security',
        description: 'Lorem consectetur adipi elitsed tempono.',
    },
    {
        icon: <Medal className="h-10 w-10 text-primary" />,
        title: 'Awards winners',
        description: 'Ariento mesfato prodo arte e eli manifesto.',
    },
    {
        icon: <User className="h-10 w-10 text-primary" />,
        title: 'Great experience',
        description: 'Lorem consectetur adipiscing elitsed pro.',
    },
]

const services = [
  {
    icon: <Cpu size={32} />,
    title: 'IT-Management',
    description: 'We provide to you the best choices for you. Adjust it to your needs and make sure you undergo.',
    href: '/layanan',
  },
  {
    icon: <ShieldCheck size={32} />,
    title: 'Data Security',
    description: 'We provide to you the best choices for you. Adjust it to your needs and make sure you undergo.',
    href: '/layanan',
  },
  {
    icon: <Code2 size={32} />,
    title: 'Web Development',
    description: 'We provide to you the best choices for you. Adjust it to your needs and make sure you undergo.',
    href: '/layanan',
  },
  {
    icon: <Headphones size={32} />,
    title: 'IT Support',
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
      {/* Hero Section */}
      <section className="relative min-h-[700px] md:min-h-[800px] flex items-center bg-cover bg-center bg-no-repeat" style={{backgroundImage: "url('https://placehold.co/1920x1080.png')"}}>
        <div className="absolute inset-0 bg-white/50"></div>
        <div className="container mx-auto px-4 relative z-10 text-center text-foreground">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-headline font-extrabold uppercase leading-tight mb-6 fade-in-up">
              Creative solutions to improve your business
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto fade-in-up" style={{animationDelay: '0.2s'}}>
              We are a passionate team of software engineers, designers, and strategists who are committed to helping businesses of all sizes succeed in the digital world.
            </p>
            <div className="flex justify-center items-center gap-4 fade-in-up" style={{animationDelay: '0.4s'}}>
              <Button asChild size="lg">
                <Link href="/layanan">Our services</Link>
              </Button>
               <Button asChild size="lg" variant="outline" className="border-foreground">
                <Link href="/hubungi-kami">Contact us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="bg-background">
          <div className="container mx-auto px-4 relative z-10 -mt-20">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {featureCards.map((card, index) => (
                      <Card key={index} className="p-8 text-center bg-card shadow-lg rounded-lg">
                          <div className="flex justify-center mb-6">
                            {card.icon}
                          </div>
                          <h3 className="text-xl font-bold text-primary mb-2">{card.title}</h3>
                          <p className="text-muted-foreground">{card.description}</p>
                      </Card>
                  ))}
              </div>
          </div>
      </section>

      {/* About Section */}
      <section className="py-20 md:py-28 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
             <div>
              <p className="font-semibold text-primary uppercase tracking-widest mb-2">About us</p>
              <h2 className="text-4xl md:text-5xl font-headline font-extrabold mb-6">We are the best IT solution</h2>
              <p className="text-muted-foreground mb-6">We are a passionate team of software engineers, designers, and strategists who are committed to helping businesses of all sizes succeed in the digital world. We believe that technology can be a powerful tool for good, and we are dedicated to using our skills and expertise to make a positive impact.</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                  <span className="font-semibold text-lg">Bespoke software solutions</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                  <span className="font-semibold text-lg">Human-centered design</span>
                </li>
                 <li className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                  <span className="font-semibold text-lg">Cloud-native architecture</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <Image 
                src="https://placehold.co/600x600.png"
                alt="About Daltech"
                width={570}
                height={570}
                className="rounded-lg shadow-lg"
                data-ai-hint="team work office"
              />
            </div>
          </div>
        </div>
      </section>

       {/* Services Section */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <p className="font-semibold text-primary uppercase tracking-widest mb-2">What we do</p>
                <h2 className="text-4xl md:text-5xl font-headline font-extrabold">We provide the best services for you</h2>
            </div>
           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
                <ServiceCard key={index} {...service} />
            ))}
           </div>
        </div>
      </section>
      
       {/* CTA Section */}
      <section className="py-20 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-headline font-extrabold mb-4">Let's build something great together</h2>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">Ready to start a project? We are here to help you.</p>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link href="/hubungi-kami">Get a Free Quote</Link>
            </Button>
        </div>
      </section>
      
      {/* Testimonial Section */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
           <TestimonialCarousel />
        </div>
      </section>
      
       {/* Projects Section */}
      <section className="py-20 md:py-28 bg-secondary">
          <div className="container mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto mb-16">
                  <p className="font-semibold text-primary uppercase tracking-widest mb-2">Our projects</p>
                  <h2 className="text-4xl md:text-5xl font-headline font-extrabold">Our latest case studies</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                  {projects.map((project, index) => (
                      <div key={index} className="group relative overflow-hidden rounded-lg">
                          <Image src={project.image} alt={project.title} width={400} height={400} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" data-ai-hint={project.aiHint}/>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                          <div className="absolute bottom-0 left-0 p-6 text-white">
                              <p className="text-primary font-semibold text-sm">{project.category}</p>

                              <h3 className="text-2xl font-bold font-headline mt-1 transition-colors group-hover:text-primary">
                                <Link href="#">{project.title}</Link>
                              </h3>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

       {/* Blog Section */}
      <section className="py-20 md:py-28 bg-background">
          <div className="container mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto mb-16">
                  <p className="font-semibold text-primary uppercase tracking-widest mb-2">Our Blog</p>
                  <h2 className="text-4xl md:text-5xl font-headline font-extrabold">Latest news & articles</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                  {blogPosts.map((post, index) => (
                      <div key={index} className="group bg-card p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow">
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
