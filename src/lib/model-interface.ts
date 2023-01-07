// interface Skill{
// 	name: string
// };

interface SkillMap{
	[key: int]: string
	// this object maps skill# to the skill name
}

interface Capstone{
	// id: int,
	name: string,
	skills: int[], // array of skill#, as indicated by a SkillMap
	minStudents: int,
	maxStudents: int
};

interface CapstoneMap{
	[key: int]: Capstone 
	// this object maps capstone# to a capstone
}

interface PrefMapping{
	// maps the capstone# -> preference#
	// capstone# is indicated by a CapstoneMap
	[key: int]: int;
}

interface Student{
	// id:int,
	name: string,
	skills: int[], // array of skill#, as indicated by a SkillMap
	preferences: PrefMapping

};

interface StudentMap{
	[key: int]: Student 
}

interface Result{
	
}