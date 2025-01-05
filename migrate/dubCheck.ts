// import dayjs from 'dayjs';
// import genreData from './data/music-genre-dataset.json';
// import fs from 'fs';
// import path from 'path';

// // Function to generate a random date between two dates
// function getRandomDate(startDate: string, endDate: string) {
//   const start = dayjs(startDate).valueOf(); // Convert start date to timestamp
//   const end = dayjs(endDate).valueOf(); // Convert end date to timestamp

//   if (start >= end) {
//     throw new Error('Start date must be before end date');
//   }

//   const randomTimestamp = Math.floor(Math.random() * (end - start)) + start;
//   return dayjs(randomTimestamp).toISOString(); // Format the random date
// }

// const genreDataNew: any = [];

// genreData.forEach((genre) => {
//   const findData = genreDataNew.find(
//     (data: any) => data.name.toLowerCase() === genre.name.toLowerCase(),
//   );
//   if (!findData) {
//     genreDataNew.push({
//       ...genre,
//       createdAt: { $date: getRandomDate('2023-01-01', '2023-12-31') },
//       updatedAt: { $date: getRandomDate('2024-01-01', '2024-12-31') },
//     });
//   }
// });

// fs.writeFileSync(
//   path.join(__dirname, 'data/music-genre-dataset-new.json'),
//   JSON.stringify(genreDataNew, null, 2),
// );

// to run this file, run npx tsx migrate/dubCheck.ts
