"use client";


import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { Grade } from "@prisma/client";

// export enum Grade {
//   ALL = "all",
//   KINDERGARTEN = "Kindergarten",
//   GRADE_1 = "Grade 1",
//   GRADE_2 = "Grade 2",
//   GRADE_3 = "Grade 3",
//   GRADE_4 = "Grade 4",
//   GRADE_5 = "Grade 5",
//   GRADE_6 = "Grade 6",
//   GRADE_7 = "Grade 7",
//   GRADE_8 = "Grade 8",
//   GRADE_9 = "Grade 9",
//   GRADE_10 = "Grade 10",
//   GRADE_11 = "Grade 11",
//   GRADE_12 = "Grade 12",
// }

type GradeOption = {
  id: number;
  label: string;
  value: Grade;
};

const gradeOptions: GradeOption[] = [
  { id: 0, label: "All Grades", value: Grade.ALL },
  { id: 1, label: "Kindergarten", value: Grade.KINDERGARTEN },
  { id: 2, label: "Grade 1", value: Grade.GRADE_1 },
  { id: 3, label: "Grade 2", value: Grade.GRADE_2 },
  { id: 4, label: "Grade 3", value: Grade.GRADE_3 },
  { id: 5, label: "Grade 4", value: Grade.GRADE_4 },
  { id: 6, label: "Grade 5", value: Grade.GRADE_5 },
  { id: 7, label: "Grade 6", value: Grade.GRADE_6 },
  { id: 8, label: "Grade 7", value: Grade.GRADE_7 },
  { id: 9, label: "Grade 8", value: Grade.GRADE_8 },
  { id: 10, label: "Grade 9", value: Grade.GRADE_9 },
  { id: 11, label: "Grade 10", value: Grade.GRADE_10 },
  { id: 12, label: "Grade 11", value: Grade.GRADE_11 },
  { id: 13, label: "Grade 12", value: Grade.GRADE_12 },
];

interface GradeDropdownProps {
  value: Grade;
  onChange: (value: Grade) => void;
}

export function GradeDropdown({ value, onChange }: GradeDropdownProps) {
  return (
    <Select onValueChange={onChange} value={value} defaultValue={Grade.ALL}>
      <SelectTrigger className="min-h-[50px] w-[180px] cursor-pointer">
        <SelectValue placeholder="Select a grade" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Grades</SelectLabel>
          {gradeOptions.map((option) => (
            <SelectItem key={option.id} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
