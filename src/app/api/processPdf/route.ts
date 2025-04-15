import { NextResponse } from "next/server";
import { pdfParsingHelper } from "~/lib/buildHelpers";

export const GET = async (req: Request) => {
  const mockData = [
    {
      kind: "customsearch#result",
      title: "Untitled",
      htmlTitle: "Untitled",
      link: "https://mathartfun.com/TessItemJ1692Contents.pdf",
      displayLink: "mathartfun.com",
      snippet:
        "Multiplication: Two-Digit Number by One-Digit Number, Regrouping Ones and Tens. Multiplication: Two-Digit Number by Two-Digit Number, Regrouping Ones ...",
      htmlSnippet:
        "<b>Multiplication: Two-Digit</b> Number by One-Digit Number, Regrouping Ones and Tens. <b>Multiplication: Two-Digit</b> Number by Two-Digit Number, Regrouping Ones&nbsp;...",
      formattedUrl: "https://mathartfun.com/TessItemJ1692Contents.pdf",
      htmlFormattedUrl: "https://mathartfun.com/TessItemJ1692Contents.pdf",
      pagemap: {
        metatags: [
          {
            moddate: "Mon Jun 21 12:04:02 2010",
            creationdate: "Mon Jun 21 12:00:11 2010",
            producer:
              "Adobe Photoshop for Macintosh -- Image Conversion Plug-in",
          },
        ],
      },
      mime: "application/pdf",
      fileFormat: "PDF/Adobe Acrobat",
    },
    {
      kind: "customsearch#result",
      title: "Untitled",
      htmlTitle: "Untitled",
      link: "https://www.trusd.net/documents/Academics/Curriculum%20and%20Instruction/Mathematics/K-6%20Math/SWUN%20Sample%20Posters-Procedures%20Grades%202-8.pdf",
      displayLink: "www.trusd.net",
      snippet:
        "Multiplication: Two-Digit by Two-. Digit Area Model. Obj: Today, we will multiply two-digit by two-digit numbers using an area mode. Vocab: X. 20. +. 9. 30 + 20.",
      htmlSnippet:
        "<b>Multiplication: Two-Digit</b> by Two-. Digit Area Model. Obj: Today, we will multiply two-digit by two-digit numbers using an area mode. Vocab: X. 20. +. 9. 30 + 20.",
      formattedUrl:
        "https://www.trusd.net/.../SWUN%20Sample%20Posters-Procedures%20Gra...",
      htmlFormattedUrl:
        "https://www.trusd.net/.../SWUN%20Sample%20Posters-Procedures%20Gra...",
      pagemap: {
        metatags: [
          {
            moddate: "Wed Sep  6 04:18:04 2017",
            creationdate: "Wed Sep  6 17:55:28 2017",
            producer: "iPhone OS 10.3.3 Quartz PDFContext",
          },
        ],
      },
      mime: "application/pdf",
      fileFormat: "PDF/Adobe Acrobat",
    },
    {
      kind: "customsearch#result",
      title: "Stages in Multiplication Multiplication – Early Stages (EYFS ...",
      htmlTitle:
        "Stages in Multiplication Multiplication – Early Stages (EYFS ...",
      link: "https://www.hitherfield.co.uk/MainFolder/LJP/FIles/Maths-Documents/Stages-in-Multiplication.pdf",
      displayLink: "www.hitherfield.co.uk",
      snippet:
        "Expanded short multiplication (two-digit number by a one-. Page 15. digit number):. 36 x 4 = 144. 6. 12. 18. 24. 30. 60. 90. 120. 120 + 24 = 144. 30 + 6. X 4. 2 ...",
      htmlSnippet:
        "Expanded short <b>multiplication (two-digit</b> number by a one-. Page 15. digit number):. 36 x 4 = 144. 6. 12. 18. 24. 30. 60. 90. 120. 120 + 24 = 144. 30 + 6. X 4. 2&nbsp;...",
      formattedUrl:
        "https://www.hitherfield.co.uk/MainFolder/.../Stages-in-Multiplication.pdf",
      htmlFormattedUrl:
        "https://www.hitherfield.co.uk/MainFolder/.../Stages-in-Multiplication.pdf",
      pagemap: {
        cse_thumbnail: [
          {
            src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0BE9VyjTcksF0D5yYgbJoGMF0TN-FkMtlCrfyqvlQesFeRr5MDcHqvPA&s",
            width: "267",
            height: "189",
          },
        ],
        metatags: [
          {
            moddate: "D:20160201175303Z00'00'",
            creator: "Word",
            creationdate: "D:20160201175303Z00'00'",
            producer: "Mac OS X 10.11.3 Quartz PDFContext",
            title:
              "Microsoft Word - Stages in Multiplication - final 18.12.14.docx",
          },
        ],
        cse_image: [
          {
            src: "x-raw-image:///221ad5f2a5ac4ab5779abb73c0387e4e3599c6d3728ff52f433094cefe6888f2",
          },
        ],
      },
      mime: "application/pdf",
      fileFormat: "PDF/Adobe Acrobat",
    },
    {
      kind: "customsearch#result",
      title:
        "Multiplication - Stage Three Recall and use multiplication facts for ...",
      htmlTitle:
        "Multiplication - Stage Three Recall and use multiplication facts for ...",
      link: "https://www.waverley-abbey.surrey.sch.uk/attachments/download.asp?file=808&type=pdf",
      displayLink: "www.waverley-abbey.surrey.sch.uk",
      snippet:
        "multiplication (two-digit number multiplied by a one-digit number). Expanded Long Multiplication. Compact Long Multiplication (Formal method). When children ...",
      htmlSnippet:
        "<b>multiplication (two-digit</b> number multiplied by a one-digit number). Expanded Long Multiplication. Compact Long Multiplication (Formal method). When children&nbsp;...",
      formattedUrl:
        "https://www.waverley-abbey.surrey.sch.uk/attachments/download.asp?...",
      htmlFormattedUrl:
        "https://www.waverley-abbey.surrey.sch.uk/attachments/download.asp?...",
      pagemap: {
        cse_thumbnail: [
          {
            src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQouNK1-OAkhFk5lkbu30cka-ykybaC7FFUy2Gjug84vxqkJjKGP5Us4FcG&s",
            width: "278",
            height: "182",
          },
        ],
        metatags: [
          {
            moddate: "D:20220918190236+01'00'",
            creator: "Microsoft® Word 2019",
            creationdate: "D:20220918190236+01'00'",
            author: "kitcoli",
            producer: "Microsoft® Word 2019",
          },
        ],
        cse_image: [
          {
            src: "x-raw-image:///27389cb6b02ada9975ba810847f01d9fa638ae08b8b0dcf6c0a19e4b4c71ab6b",
          },
        ],
      },
      mime: "application/pdf",
      fileFormat: "PDF/Adobe Acrobat",
    },
    {
      kind: "customsearch#result",
      title:
        "Stages in Multiplication Multiplication – Early Years (EYFS) Children ...",
      htmlTitle:
        "Stages in Multiplication Multiplication – Early Years (EYFS) Children ...",
      link: "https://elsworthprimary.org/wp-content/uploads/2019/07/3fb3c6_62b8ea69ca5448f2ba7c6194d2c78255.pdf",
      displayLink: "elsworthprimary.org",
      snippet:
        "Further develop the grid method for two-digit numbers multiplied by a one-digit number. Expanded short multiplication (two-digit number by a one-digit number):.",
      htmlSnippet:
        "Further develop the grid method for two-digit numbers multiplied by a one-digit number. Expanded short <b>multiplication (two-digit</b> number by a one-digit number):.",
      formattedUrl:
        "https://elsworthprimary.org/.../3fb3c6_62b8ea69ca5448f2ba7c6194d2c782...",
      htmlFormattedUrl:
        "https://elsworthprimary.org/.../3fb3c6_62b8ea69ca5448f2ba7c6194d2c782...",
      pagemap: {
        cse_thumbnail: [
          {
            src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGbYqr9NqmTeHCe9Ed3mjpp6yzJotGKKQupFvrmLRwdxJIm6zSWewjNMk&s",
            width: "269",
            height: "187",
          },
        ],
        metatags: [
          {
            moddate: "D:20180103150526+00'00'",
            creator: "Microsoft® Word 2016",
            creationdate: "D:20180103150526+00'00'",
            author: "Sarah Moore",
            producer: "Microsoft® Word 2016",
          },
        ],
        cse_image: [
          {
            src: "x-raw-image:///42402a031d6d8cd3cf4243c6473d5fa2b340fd230898d9236e77d795c99d2161",
          },
        ],
      },
      mime: "application/pdf",
      fileFormat: "PDF/Adobe Acrobat",
    },
    {
      kind: "customsearch#result",
      title:
        "Effect of Area Model on Multi-Digit Multiplication Performance of ...",
      htmlTitle:
        "Effect of Area Model on Multi-Digit Multiplication Performance of ...",
      link: "https://www.atbuftejoste.com.ng/index.php/joste/article/download/1420/pdf_909",
      displayLink: "www.atbuftejoste.com.ng",
      snippet:
        "However, the grid model should be introduced at a lower level of multiplication (two-digit by one-digit) before it can be extended for multiplying bigger.",
      htmlSnippet:
        "However, the grid model should be introduced at a lower level of <b>multiplication (two-digit</b> by one-digit) before it can be extended for multiplying bigger.",
      formattedUrl:
        "https://www.atbuftejoste.com.ng/index.php/joste/article/.../1420/pdf_909",
      htmlFormattedUrl:
        "https://www.atbuftejoste.com.ng/index.php/joste/article/.../1420/pdf_909",
      pagemap: {
        cse_thumbnail: [
          {
            src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnhckpCx2-vXwNoLr5vEWeRDuiZKZDoO_wuBNuOrYAZyEUGBkJWxIB2Q&s",
            width: "197",
            height: "255",
          },
        ],
        metatags: [
          {
            moddate: "D:20211121070351+01'00'",
            creationdate: "D:20211121070349+01'00'",
            creator: "Nitro Pro 12 (12.7.0.338)",
            author: "LENOVO",
            producer: "Nitro Pro 12 (12.7.0.338)",
            title: "Microsoft Word - 1411-2989-1-SM",
          },
        ],
        cse_image: [
          {
            src: "x-raw-image:///5ad96779784ad8b28f30dea3a483a19a144e31f0f6b54a97ec209f16e0e47f18",
          },
        ],
      },
      mime: "application/pdf",
      fileFormat: "PDF/Adobe Acrobat",
    },
    {
      kind: "customsearch#result",
      title: "About-the-Course-Math-4.pdf",
      htmlTitle: "About-the-Course-Math-4.pdf",
      link: "https://www.goodandbeautiful.com/wp-content/uploads/2021/09/About-the-Course-Math-4.pdf",
      displayLink: "www.goodandbeautiful.com",
      snippet:
        "multiplication (two-digit by two-digit) perimeter and area (irregular shapes) reducing fractions to simplest form tessellations (regular and semi-regular).",
      htmlSnippet:
        "<b>multiplication (two-digit</b> by two-digit) perimeter and area (irregular shapes) reducing fractions to simplest form tessellations (regular and semi-regular).",
      formattedUrl:
        "https://www.goodandbeautiful.com/wp.../About-the-Course-Math-4.pdf",
      htmlFormattedUrl:
        "https://www.goodandbeautiful.com/wp.../About-the-Course-Math-4.pdf",
      pagemap: {
        cse_thumbnail: [
          {
            src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUHNIMGJBeM55_xiNUPpkAWVXj3lt1X8dkO9_GpttORVhZYO25_aTiuw-A&s",
            width: "250",
            height: "201",
          },
        ],
        metatags: [
          {
            moddate: "D:20210714133958-05'00'",
            creationdate: "D:20210714133958-05'00'",
            creator: "Wondershare PDFelement",
            author: "hdisc",
            producer: "Wondershare PDFelement",
          },
        ],
        cse_image: [
          {
            src: "x-raw-image:///bf225fb94bc1221a72816e04c90342c3a06fb7fe9e100c52a2bf666e52e210b5",
          },
        ],
      },
      mime: "application/pdf",
      fileFormat: "PDF/Adobe Acrobat",
    },
    {
      kind: "customsearch#result",
      title: "Addition - Year Three",
      htmlTitle: "Addition - Year Three",
      link: "https://www.northbaddesley-jun.hants.sch.uk/attachments/download.asp?file=220&type=pdf",
      displayLink: "www.northbaddesley-jun.hants.sch.uk",
      snippet:
        "Expanded short multiplication (two-digit number by a one-digit number):. 36 x 4 = 144. 30 + 6. X. 4. 2 4. (4 x 6 = 24). + 1 2 0. (4 x 30 = 120). 1 4 4. Include ...",
      htmlSnippet:
        "Expanded short <b>multiplication (two-digit</b> number by a one-digit number):. 36 x 4 = 144. 30 + 6. X. 4. 2 4. (4 x 6 = 24). + 1 2 0. (4 x 30 = 120). 1 4 4. Include&nbsp;...",
      formattedUrl:
        "https://www.northbaddesley-jun.hants.sch.uk/.../download.asp?file=220...",
      htmlFormattedUrl:
        "https://www.northbaddesley-jun.hants.sch.uk/.../download.asp?file=220...",
      pagemap: {
        cse_thumbnail: [
          {
            src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOAqr8qLmM_ByB7-iQt2AJrt45fcUE-fREvxoyqA4Id2iwI9wi5UZXnWM&s",
            width: "189",
            height: "267",
          },
        ],
        metatags: [
          {
            moddate: "D:20181206154940+00'00'",
            creator: "Microsoft® Word 2016",
            creationdate: "D:20181206154940+00'00'",
            author: "User",
            producer: "Microsoft® Word 2016",
            title:
              "Microsoft Word - calculation_policy__new_curriculum__November_2013_FINAL _1_.doc",
          },
        ],
        cse_image: [
          {
            src: "x-raw-image:///4a64385969e19ad2d2ff042b54a61aa8cd4451dab4a0668d4d33b17565f92a2b",
          },
        ],
      },
      mime: "application/pdf",
      fileFormat: "PDF/Adobe Acrobat",
    },
    {
      kind: "customsearch#result",
      title: "Grade 4 Units 1 & 2 Week 2",
      htmlTitle: "Grade 4 Units 1 &amp; 2 Week 2",
      link: "https://swunmath.com/homework/G4Week2SchoolClosure.pdf",
      displayLink: "swunmath.com",
      snippet:
        "Unit 2 Lesson 8: Multiplication: Two-Digit by Two-Digit − Area Model. Student Practice. Directions: Multiply using the area model. 1. 35 × 22. 2. 62 × 14. 3 ...",
      htmlSnippet:
        "Unit 2 Lesson 8: <b>Multiplication: Two-Digit</b> by Two-Digit − Area Model. Student Practice. Directions: Multiply using the area model. 1. 35 × 22. 2. 62 × 14. 3&nbsp;...",
      formattedUrl: "https://swunmath.com/homework/G4Week2SchoolClosure.pdf",
      htmlFormattedUrl:
        "https://swunmath.com/homework/G4Week2SchoolClosure.pdf",
      pagemap: {
        cse_thumbnail: [
          {
            src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlPOK2vsx1uLizyOSSkoSCEovSbueXpuSrTnz6gqEuTp9x8JnQEFECF2I5&s",
            width: "197",
            height: "255",
          },
        ],
        metatags: [
          {
            moddate: "D:20200315090937-07'00'",
            creationdate: "D:20200314164115-07'00'",
            creator: "Adobe Acrobat Pro DC 15.6.30510",
            author: "Carrie Mitchell",
            producer: "Adobe Acrobat Pro DC 15.6.30510",
          },
        ],
        cse_image: [
          {
            src: "x-raw-image:///f2a729948c940d8068b837ccd4b8dbb74071fa85e5dcb912ece09c51feded33a",
          },
        ],
      },
      mime: "application/pdf",
      fileFormat: "PDF/Adobe Acrobat",
    },
    {
      kind: "customsearch#result",
      title: "SYLLABUS FOR NAVMO 2018-19",
      htmlTitle: "SYLLABUS FOR NAVMO 2018-19",
      link: "https://mpeimmo.com/media/olympiad/syllabus.pdf",
      displayLink: "mpeimmo.com",
      snippet:
        "➢ 10 Question – Multiplication Two Digit by Two Digit (11X11). Page 3. THETA GROUP (CLASS 6 - CLASS 12 ). VEDIC MATHS. Total Question-70/20 min. Total Level-2.",
      htmlSnippet:
        "➢ 10 Question – <b>Multiplication Two Digit</b> by Two Digit (11X11). Page 3. THETA GROUP (CLASS 6 - CLASS 12 ). VEDIC MATHS. Total Question-70/20 min. Total Level-2.",
      formattedUrl: "https://mpeimmo.com/media/olympiad/syllabus.pdf",
      htmlFormattedUrl: "https://mpeimmo.com/media/olympiad/syllabus.pdf",
      pagemap: {
        cse_thumbnail: [
          {
            src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKJJ8u7Jz6B38NL1Td9PBSDvx1aJnliIfC78TkCeTM1nTvGjMzQOuAwnw&s",
            width: "286",
            height: "176",
          },
        ],
        metatags: [
          {
            producer: "Skia/PDF m69",
          },
        ],
        cse_image: [
          {
            src: "x-raw-image:///922fcf11c1853b69e0b2f81ab49d361754754e60cedbddb600422c627bccc85a",
          },
        ],
      },
      mime: "application/pdf",
      fileFormat: "PDF/Adobe Acrobat",
    },
  ];
  const results = [];
  const item = mockData[2];
  const relevantPages = await pdfParsingHelper.getFileRelevancy(
    item!.link,
    "Multiplication 2 digit",
  );
  return NextResponse.json({ relevantPages });
};
