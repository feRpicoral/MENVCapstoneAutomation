// interface Skill{
// 	name: string
// };

export interface SkillMap{
	[key: int]: string
	// this object maps skill# to the skill name
}

export interface Capstone{
	// id: int,
	name: string,
	skills: int[], // array of skill#, as indicated by a SkillMap
	minStudents: int,
	maxStudents: int
};

export interface CapstoneMap{
	[key: int]: Capstone 
	// this object maps capstone# to a capstone
}

export interface PrefMapping{
	// maps the capstone# -> preference#
	// capstone# is indicated by a CapstoneMap
	[key: int]: int;
}

export interface Student{
	// id:int,
	name: string,
	skills: int[], // array of skill#, as indicated by a SkillMap
	preferences: PrefMapping

};

export interface StudentMap{
	[key: int]: Student 
}

interface Result{

}