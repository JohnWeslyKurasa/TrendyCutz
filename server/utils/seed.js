import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

import User from '../models/User.js';
import Worker from '../models/Worker.js';
import Service from '../models/Service.js';
import Appointment from '../models/Appointment.js';
import Review from '../models/Review.js';

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      Worker.deleteMany({}),
      Service.deleteMany({}),
      Appointment.deleteMany({}),
      Review.deleteMany({})
    ]);
    console.log('Cleared existing collections');

    // 1. Create Admin User
    const admin = await User.create({
      fullName: 'Trendy Cutz Admin',
      email: 'admin@trendycutz.com',
      phone: '+919121830372',
      password: 'admin@123',
      role: 'admin'
    });
    console.log('Admin user created: admin@trendycutz.com / admin@123');

    // 2. Create Test Customer + Additional Demo Reviewers
    const defaultPassword = 'user@123';
    const mainCustomer = await User.create({
      fullName: 'Test Customer',
      email: 'customer@test.com',
      phone: '+919876543210',
      password: defaultPassword,
      role: 'user'
    });

    const reviewers = await User.create([
      { fullName: 'Karthik Rao', email: 'karthik.rao@gmail.com', phone: '+919848011223', password: defaultPassword, role: 'user' },
      { fullName: 'Sneha Verma', email: 'sneha.verma@outlook.com', phone: '+919848022334', password: defaultPassword, role: 'user' },
      { fullName: 'Mohammed Ali', email: 'mohammed.ali@yahoo.com', phone: '+919848033445', password: defaultPassword, role: 'user' },
      { fullName: 'Divya Sharma', email: 'divya.sharma@gmail.com', phone: '+919848044556', password: defaultPassword, role: 'user' },
      { fullName: 'Rajesh Khanna', email: 'rajesh.k@rediffmail.com', phone: '+919848055667', password: defaultPassword, role: 'user' },
      { fullName: 'Ananya Joshi', email: 'ananya.joshi@gmail.com', phone: '+919848066778', password: defaultPassword, role: 'user' },
      { fullName: 'Vikram Reddy', email: 'vikram.reddy@gmail.com', phone: '+919848077889', password: defaultPassword, role: 'user' },
      { fullName: 'Pooja Hegde', email: 'pooja.h@gmail.com', phone: '+919848088990', password: defaultPassword, role: 'user' }
    ]);
    console.log(`Created ${reviewers.length + 1} customer accounts`);

    // 3. Create Demo Team (Workers)
    const workers = await Worker.create([
      {
        name: 'Rahul Sharma',
        role: 'Senior Hair Stylist & Creative Director',
        specialization: 'Precision Fades, Texture Cuts & Modern Styling',
        experience: 6,
        bio: 'Rahul trained under master stylists in Mumbai and has spent 6+ years perfecting precision haircuts, skin fades, and textured styling for modern men and women.',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        workingHours: { start: '08:00', end: '21:00' },
        breakTime: { start: '13:00', end: '14:00' },
        slotDuration: 30,
        completedAppointments: 420,
        sortOrder: 1
      },
      {
        name: 'Arjun Reddy',
        role: 'Master Barber & Beard Specialist',
        specialization: 'Royal Hot Towel Shaves, Beard Sculpting & Classic Cuts',
        experience: 5,
        bio: 'Arjun is a master craftsman of masculine grooming. With 5 years of mastery in straight-razor hot towel shaves and razor-sharp beard contouring, he delivers perfection every time.',
        workingDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        workingHours: { start: '09:00', end: '21:00' },
        breakTime: { start: '13:30', end: '14:30' },
        slotDuration: 30,
        completedAppointments: 385,
        sortOrder: 2
      },
      {
        name: 'Priya Nair',
        role: 'Senior Hair & Beauty Specialist',
        specialization: 'Keratin Treatments, Hair Color & Bridal Haircare',
        experience: 5,
        bio: 'Certified in advanced hair restoration and coloring techniques, Priya brings precision and artistic flair to keratin smoothing, balayage, and restorative hair treatments.',
        workingDays: ['Monday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        workingHours: { start: '10:00', end: '20:00' },
        breakTime: { start: '14:00', end: '15:00' },
        slotDuration: 45,
        completedAppointments: 340,
        sortOrder: 3
      },
      {
        name: 'Sneha Kulkarni',
        role: 'Aesthetician & Skin Spa Therapist',
        specialization: 'Hydra Facials, Deep Detox & Radiance Glow Therapy',
        experience: 4,
        bio: 'Sneha specializes in customized dermatological skincare, rejuvenating fruit enzyme peels, and revitalizing facial therapies that leave skin fresh, youthful, and glowing.',
        workingDays: ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        workingHours: { start: '09:00', end: '20:00' },
        breakTime: { start: '13:00', end: '14:00' },
        slotDuration: 30,
        completedAppointments: 295,
        sortOrder: 4
      },
      {
        name: 'Vikram Varma',
        role: 'Men\'s Grooming Expert & Stylist',
        specialization: 'Modern Pompadours, Tapers & Scalp Care',
        experience: 4,
        bio: 'Vikram seamlessly combines contemporary runway trends with classic barbering. Known for meticulous taper fades, razor line-ups, and friendly styling consultations.',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday', 'Sunday'],
        workingHours: { start: '09:00', end: '21:00' },
        breakTime: { start: '14:00', end: '15:00' },
        slotDuration: 30,
        completedAppointments: 260,
        sortOrder: 5
      },
      {
        name: 'Ananya Sen',
        role: 'Creative Colorist & Spa Specialist',
        specialization: 'Moroccan Hair Spa, Balayage & Scalp Therapies',
        experience: 3,
        bio: 'Ananya has a gentle touch and profound expertise in therapeutic scalp massages, nourishing spa rituals, and bespoke hair coloring that enhances your natural beauty.',
        workingDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        workingHours: { start: '10:00', end: '20:00' },
        breakTime: { start: '13:30', end: '14:30' },
        slotDuration: 45,
        completedAppointments: 215,
        sortOrder: 6
      }
    ]);
    console.log(`Created ${workers.length} professionals for the team`);

    // 4. Create Demo Services across categories
    const services = await Service.create([
      {
        name: 'Premium Haircut & Styling',
        category: 'Hair',
        description: 'Precision scissor and clipper haircut tailored to your face structure. Includes refreshing wash, conditioning, and professional blowdry styling finish.',
        price: 299,
        duration: 30,
        availableWorkers: [workers[0]._id, workers[1]._id, workers[4]._id],
        sortOrder: 1
      },
      {
        name: 'Royal Fade & Texture Cut',
        category: 'Hair',
        description: 'Clean skin fade, low taper, or drop fade with tailored top texturing and beard transition blend. Styled with premium matte clay.',
        price: 399,
        duration: 45,
        availableWorkers: [workers[0]._id, workers[1]._id, workers[4]._id],
        sortOrder: 2
      },
      {
        name: 'Keratin Smooth Therapy',
        category: 'Hair',
        description: 'Intensive keratin protein treatment that eliminates frizz, infuses rich moisture, and delivers ultra-sleek, mirror-shine manageable hair.',
        price: 1499,
        duration: 90,
        availableWorkers: [workers[2]._id, workers[5]._id],
        sortOrder: 3
      },
      {
        name: 'Root Touch-Up & Global Color',
        category: 'Hair',
        description: 'Ammonia-free, long-lasting hair coloring using premium salon formulations for 100% grey coverage and vibrant, dimensional shine.',
        price: 899,
        duration: 60,
        availableWorkers: [workers[2]._id, workers[5]._id],
        sortOrder: 4
      },
      {
        name: 'Royal Hot Towel Shave',
        category: 'Beard',
        description: 'Traditional barbershop straight-razor shave with warm herbal steam towels, pre-shave botanical oils, rich lather, and cold eucalyptus compress.',
        price: 249,
        duration: 30,
        availableWorkers: [workers[1]._id, workers[4]._id],
        sortOrder: 5
      },
      {
        name: 'Beard Sculpting & Contouring',
        category: 'Beard',
        description: 'Detailed beard design, cheek line blade finish, neckline cleanup, and conditioning cedarwood beard butter application.',
        price: 299,
        duration: 35,
        availableWorkers: [workers[0]._id, workers[1]._id, workers[4]._id],
        sortOrder: 6
      },
      {
        name: 'Quick Beard Trim & Edge',
        category: 'Beard',
        description: 'Fast, crisp clipper trim to maintain length and clean up stray edges for busy professionals on the go.',
        price: 149,
        duration: 20,
        availableWorkers: [workers[0]._id, workers[1]._id, workers[4]._id],
        sortOrder: 7
      },
      {
        name: 'Hydra-Glow Radiance Facial',
        category: 'Beauty',
        description: 'Multi-step deep hydration facial with gentle exfoliation, hyaluronic serum infusion, and rejuvenating peel-off mask for an instant youthful glow.',
        price: 899,
        duration: 60,
        availableWorkers: [workers[2]._id, workers[3]._id],
        sortOrder: 8
      },
      {
        name: 'Charcoal Detox Deep Cleanse',
        category: 'Beauty',
        description: 'Activated bamboo charcoal facial targeting blackheads, unclogging deep pores, and neutralizing environmental oil and pollution.',
        price: 699,
        duration: 45,
        availableWorkers: [workers[3]._id],
        sortOrder: 9
      },
      {
        name: 'D-Tan Clarifying Face & Neck Care',
        category: 'Beauty',
        description: 'Natural botanical pack to gently reverse sun tan, even out hyperpigmentation, and restore natural radiance to face and neck.',
        price: 499,
        duration: 30,
        availableWorkers: [workers[2]._id, workers[3]._id],
        sortOrder: 10
      },
      {
        name: 'Moroccan Argan Hair Spa',
        category: 'Spa',
        description: 'Deep conditioning hair mask with pure cold-pressed argan oil, warm ozone towel steam, and relaxing 20-minute acupressure scalp massage.',
        price: 799,
        duration: 60,
        availableWorkers: [workers[2]._id, workers[3]._id, workers[5]._id],
        sortOrder: 11
      },
      {
        name: 'Anti-Dandruff Scalp Detox',
        category: 'Spa',
        description: 'Clarifying tea-tree and zinc therapy formulated to soothe irritation, remove flaking buildup, and rejuvenate follicle roots.',
        price: 649,
        duration: 45,
        availableWorkers: [workers[2]._id, workers[5]._id],
        sortOrder: 12
      },
      {
        name: 'Head & Shoulder Relaxation Massage',
        category: 'Spa',
        description: 'Therapeutic pressure-point massage using warm essential oils to release upper back tension, melt away headaches, and soothe fatigue.',
        price: 499,
        duration: 30,
        availableWorkers: [workers[3]._id, workers[5]._id],
        sortOrder: 13
      }
    ]);
    console.log(`Created ${services.length} demo services across Hair, Beard, Beauty, and Spa`);

    // 5. Update workers with their assigned service IDs
    await Worker.findByIdAndUpdate(workers[0]._id, {
      services: [services[0]._id, services[1]._id, services[5]._id, services[6]._id]
    });
    await Worker.findByIdAndUpdate(workers[1]._id, {
      services: [services[0]._id, services[1]._id, services[4]._id, services[5]._id, services[6]._id]
    });
    await Worker.findByIdAndUpdate(workers[2]._id, {
      services: [services[2]._id, services[3]._id, services[7]._id, services[9]._id, services[10]._id, services[11]._id]
    });
    await Worker.findByIdAndUpdate(workers[3]._id, {
      services: [services[7]._id, services[8]._id, services[9]._id, services[10]._id, services[12]._id]
    });
    await Worker.findByIdAndUpdate(workers[4]._id, {
      services: [services[0]._id, services[1]._id, services[4]._id, services[5]._id, services[6]._id]
    });
    await Worker.findByIdAndUpdate(workers[5]._id, {
      services: [services[2]._id, services[3]._id, services[10]._id, services[11]._id, services[12]._id]
    });
    console.log('Worker-to-service links updated');

    // 6. Create Demo Completed Appointments & Authentic Reviews for EACH Professional
    const demoReviewsData = [
      // Rahul Sharma (Senior Hair Stylist)
      {
        workerIdx: 0,
        serviceIdx: 0,
        userIdx: 0, // Karthik Rao
        rating: 5,
        date: '2026-09-15',
        time: '11:00',
        comment: 'Hands down the best haircut experience in Suraram! Rahul analyzed my face shape and suggested a textured taper that looks incredible. Very polite and professional.'
      },
      {
        workerIdx: 0,
        serviceIdx: 1,
        userIdx: 4, // Rajesh Khanna
        rating: 5,
        date: '2026-09-18',
        time: '14:30',
        comment: 'Rahul is a master with the clippers. The skin fade was seamlessly blended with no harsh lines. The salon ambience is top notch as well.'
      },
      {
        workerIdx: 0,
        serviceIdx: 5,
        userIdx: 6, // Vikram Reddy
        rating: 5,
        date: '2026-09-21',
        time: '16:00',
        comment: 'Super sharp haircut and beard styling. Rahul took his time and made sure every single detail was on point. Definitely my go-to stylist from now on!'
      },

      // Arjun Reddy (Master Barber)
      {
        workerIdx: 1,
        serviceIdx: 4,
        userIdx: 2, // Mohammed Ali
        rating: 5,
        date: '2026-09-12',
        time: '10:30',
        comment: 'The Royal Hot Towel Shave with Arjun was pure luxury. The eucalyptus steam towels and razor precision left my skin feeling refreshed and baby smooth.'
      },
      {
        workerIdx: 1,
        serviceIdx: 5,
        userIdx: 0, // Karthik Rao
        rating: 5,
        date: '2026-09-17',
        time: '15:00',
        comment: 'Arjun really understands beard geometry. Sculpted my unruly beard into a sharp, structured jawline. Highly recommend him for any beard styling!'
      },
      {
        workerIdx: 1,
        serviceIdx: 1,
        userIdx: 4, // Rajesh Khanna
        rating: 4,
        date: '2026-09-20',
        time: '17:30',
        comment: 'Great traditional haircut and clean straight razor finish on the neck. Quick, hygienic, and very skilled barber.'
      },

      // Priya Nair (Senior Hair & Beauty Specialist)
      {
        workerIdx: 2,
        serviceIdx: 2,
        userIdx: 1, // Sneha Verma
        rating: 5,
        date: '2026-09-10',
        time: '12:00',
        comment: 'Priya did a fabulous job with my Keratin treatment! My frizzy, dull hair is now silky, glossy, and so easy to manage. She explained the entire aftercare patiently.'
      },
      {
        workerIdx: 2,
        serviceIdx: 10,
        userIdx: 3, // Divya Sharma
        rating: 5,
        date: '2026-09-16',
        time: '15:30',
        comment: 'The Moroccan Hair Spa with Priya was heavenly. The scalp massage was so deeply relaxing, and my hair felt visibly nourished for days.'
      },
      {
        workerIdx: 2,
        serviceIdx: 3,
        userIdx: 5, // Ananya Joshi
        rating: 5,
        date: '2026-09-19',
        time: '11:30',
        comment: 'Had my root touch-up and hair spa done by Priya. The shade match was flawless and there was zero irritation. Very gentle and skilled professional.'
      },

      // Sneha Kulkarni (Aesthetician & Skin Spa Therapist)
      {
        workerIdx: 3,
        serviceIdx: 7,
        userIdx: 7, // Pooja Hegde
        rating: 5,
        date: '2026-09-11',
        time: '14:00',
        comment: 'Sneha\'s Hydra-Glow Facial is worth every single rupee! My dull skin felt instantly brightened, plump, and deeply hydrated. Extremely clean and hygienic setup.'
      },
      {
        workerIdx: 3,
        serviceIdx: 8,
        userIdx: 1, // Sneha Verma
        rating: 5,
        date: '2026-09-16',
        time: '16:00',
        comment: 'The charcoal deep detox was very effective for blackheads and excess oil. Sneha has such a gentle touch and gave great skincare advice.'
      },
      {
        workerIdx: 3,
        serviceIdx: 9,
        userIdx: 3, // Divya Sharma
        rating: 4,
        date: '2026-09-22',
        time: '18:00',
        comment: 'Tried the D-Tan face and neck therapy after a sunny vacation. Saw a noticeable difference immediately. Sneha is very pleasant and professional.'
      },

      // Vikram Varma (Men's Grooming Expert & Stylist)
      {
        workerIdx: 4,
        serviceIdx: 0,
        userIdx: 2, // Mohammed Ali
        rating: 5,
        date: '2026-09-13',
        time: '13:00',
        comment: 'Vikram gave me a classic pompadour with a sharp side part. He took time to consult with me on what would work best for my hair growth pattern. 5 stars!'
      },
      {
        workerIdx: 4,
        serviceIdx: 5,
        userIdx: 6, // Vikram Reddy
        rating: 5,
        date: '2026-09-18',
        time: '15:30',
        comment: 'Excellent beard grooming and line-up by Vikram. Very hygienic tools, clean blades, and great conversation. Will definitely be a regular here.'
      },
      {
        workerIdx: 4,
        serviceIdx: 1,
        userIdx: 0, // Karthik Rao
        rating: 4,
        date: '2026-09-23',
        time: '12:00',
        comment: 'Really good fade cut and styling. Very energetic stylist who knows modern trends well. Prompt service with no unnecessary waiting.'
      },

      // Ananya Sen (Creative Colorist & Spa Specialist)
      {
        workerIdx: 5,
        serviceIdx: 10,
        userIdx: 5, // Ananya Joshi
        rating: 5,
        date: '2026-09-14',
        time: '14:00',
        comment: 'Ananya is an absolute sweetheart. The Moroccan Argan Spa was so calming and restorative. My dry hair feels completely rejuvenated and soft.'
      },
      {
        workerIdx: 5,
        serviceIdx: 12,
        userIdx: 7, // Pooja Hegde
        rating: 5,
        date: '2026-09-19',
        time: '16:30',
        comment: 'The head and shoulder relaxation massage by Ananya is magical after a stressful week at work. She knows all the pressure points to relieve tension.'
      },
      {
        workerIdx: 5,
        serviceIdx: 11,
        userIdx: 1, // Sneha Verma
        rating: 5,
        date: '2026-09-22',
        time: '11:00',
        comment: 'Scalp detox therapy was super soothing. Ananya is very knowledgeable about hair health and gave great tips for scalp maintenance.'
      }
    ];

    console.log(`Generating ${demoReviewsData.length} completed appointments & reviews for all professionals...`);

    for (let i = 0; i < demoReviewsData.length; i++) {
      const item = demoReviewsData[i];
      const targetWorker = workers[item.workerIdx];
      const targetService = services[item.serviceIdx];
      const targetUser = reviewers[item.userIdx];

      // Create completed appointment
      const appt = await Appointment.create({
        appointmentId: `TC${String(100 + i + 1).padStart(5, '0')}`,
        user: targetUser._id,
        worker: targetWorker._id,
        service: targetService._id,
        date: item.date,
        time: item.time,
        status: 'completed',
        notes: 'Demo appointment completed with client satisfaction',
        customerName: targetUser.fullName,
        customerPhone: targetUser.phone,
        customerEmail: targetUser.email,
        isReviewed: true
      });

      // Create Review
      await Review.create({
        user: targetUser._id,
        worker: targetWorker._id,
        appointment: appt._id,
        rating: item.rating,
        comment: item.comment,
        isVisible: true,
        createdAt: new Date(`${item.date}T${item.time}:00Z`)
      });
    }

    console.log('All reviews and appointments inserted');

    // 7. Update worker ratings and counts
    for (const w of workers) {
      await w.updateRating();
    }
    console.log('Worker ratings dynamically updated from reviews');

    console.log('\nSeed completed successfully!');
    console.log('\nLogin Credentials:');
    console.log('Admin: admin@trendycutz.com / admin@123');
    console.log('User:  customer@test.com / user@123');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
