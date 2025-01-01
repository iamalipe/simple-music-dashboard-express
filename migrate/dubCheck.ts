// import genreData from './data/music-genre-dataset.json';
// import fs from 'fs';
// import path from 'path';

// const genreDataNew: any = [];

// genreData.forEach((genre) => {
//   const findData = genreDataNew.find(
//     (data: any) => data.name.toLowerCase() === genre.name.toLowerCase(),
//   );
//   if (!findData) {
//     genreDataNew.push({
//       ...genre,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     });
//   }
// });

// fs.writeFileSync(
//   path.join(__dirname, 'data/music-genre-dataset-new.json'),
//   JSON.stringify(genreDataNew, null, 2),
// );

// to run this file, run npx tsx migrate/dubCheck.ts
