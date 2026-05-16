const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding process...');

  // Clear existing data
  console.log('Cleaning up existing data...');
  await prisma.commentLike.deleteMany({});
  await prisma.videoLike.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.video.deleteMany({});
  await prisma.follow.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('Database cleaned.');

  // Create 10 users
  console.log('Creating users...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = [];
  for (let i = 1; i <= 10; i++) {
    const user = await prisma.user.create({
      data: {
        username: `user${i}`,
        email: `user${i}@example.com`,
        password: hashedPassword,
        name: `User ${i}`,
        bio: `This is the bio for user ${i}`,
        avatar: `https://i.pravatar.cc/150?u=user${i}@example.com`
      }
    });
    users.push(user);
    console.log(`Created user: ${user.username}`);
  }

  // Create 50 videos (5 per user)
  console.log('Creating videos...');

  // Real working sample videos
    const sampleVideos = [
      'https://www.w3schools.com/html/mov_bbb.mp4',
      'https://www.w3schools.com/html/movie.mp4',
      'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
      'https://samplelib.com/lib/preview/mp4/sample-10s.mp4',
      'https://samplelib.com/lib/preview/mp4/sample-15s.mp4',
    ];

    const sampleThumbnails = [
      'https://picsum.photos/336/600?random=1',
      'https://picsum.photos/336/600?random=2',
      'https://picsum.photos/336/600?random=3',
      'https://picsum.photos/336/600?random=4',
      'https://picsum.photos/336/600?random=5',
    ];

  const videos = [];
  for (let i = 0; i < users.length; i++) {
    for (let j = 1; j <= 5; j++) {
      const video = await prisma.video.create({
        data: {
          userId: users[i].id,
          title: `Video ${j} from ${users[i].username}`,
          description: `This is video ${j} from user ${users[i].username}`,
          videoUrl: sampleVideos[(j - 1) % sampleVideos.length], //  real URLs
        thumbnail: sampleThumbnails[(j - 1) % sampleThumbnails.length], //  real thumbnails
        }
      });
      videos.push(video);
      console.log(`Created video: ${video.title}`);
    }
  }

  // Create 200 comments
  console.log('Creating comments...');
  for (let i = 0; i < 200; i++) {
    const randomVideoIndex = Math.floor(Math.random() * videos.length);
    const randomUserIndex = Math.floor(Math.random() * users.length);

    const comment = await prisma.comment.create({
      data: {
        userId: users[randomUserIndex].id,
        videoId: videos[randomVideoIndex].id,
        text: `This is comment ${i + 1}. Lorem ipsum dolor sit amet.`  // 'text' not 'content'
      }
    });
    console.log(`Created comment: ${comment.id}`);
  }

  // Create 300 video likes
  console.log('Creating video likes...');
  const videoLikes = [];
  for (let i = 0; i < 300; i++) {
    const randomVideoIndex = Math.floor(Math.random() * videos.length);
    const randomUserIndex = Math.floor(Math.random() * users.length);

    const videoId = videos[randomVideoIndex].id;
    const userId = users[randomUserIndex].id;

    const existingLike = videoLikes.find(like => like.userId === userId && like.videoId === videoId);

    if (!existingLike) {
      try {
        await prisma.videoLike.create({
          data: { userId, videoId }
        });
        videoLikes.push({ userId, videoId });
        console.log(`Created video like: User ${userId} liked Video ${videoId}`);
      } catch (error) {
        console.log(`Skipping duplicate like: User ${userId} -> Video ${videoId}`);
      }
    }
  }

  // Create 150 comment likes
  console.log('Creating comment likes...');
  const comments = await prisma.comment.findMany();

  for (let i = 0; i < 150; i++) {
    const randomCommentIndex = Math.floor(Math.random() * comments.length);
    const randomUserIndex = Math.floor(Math.random() * users.length);

    const commentId = comments[randomCommentIndex].id;
    const userId = users[randomUserIndex].id;

    try {
      await prisma.commentLike.create({
        data: { userId, commentId }
      });
      console.log(`Created comment like: User ${userId} liked Comment ${commentId}`);
    } catch (error) {
      console.log(`Skipping duplicate comment like: User ${userId} -> Comment ${commentId}`);
    }
  }

  // Create 40 follows
  console.log('Creating follows...');
  for (let i = 0; i < 40; i++) {
    let followerId = Math.floor(Math.random() * 10) + 1;
    let followingId = Math.floor(Math.random() * 10) + 1;

    while (followerId === followingId) {
      followingId = Math.floor(Math.random() * 10) + 1;
    }

    try {
      await prisma.follow.create({
        data: { followerId, followingId }
      });
      console.log(`Created follow: User ${followerId} follows User ${followingId}`);
    } catch (error) {
      console.log(`Skipping duplicate follow: User ${followerId} -> User ${followingId}`);
    }
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });