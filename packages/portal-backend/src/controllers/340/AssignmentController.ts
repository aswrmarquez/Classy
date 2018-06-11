import {GradesController} from "../GradesController";
import {DatabaseController} from "../DatabaseController";
import {Grade} from "../../Types";
// import {GradePayload} from "../GradesController";
import Log from "../../../../common/Log";
import {GradePayload} from "../../../../common/types/SDMMTypes";
import {AssignmentGrade} from "../../../../common/types/CS340Types";

/*
 * Definition of controller object
 */

export class AssignmentController {
    private db: DatabaseController = DatabaseController.getInstance();
    private gc : GradesController = new GradesController();

    public async getAssignmentGrade(personId: string, assignId: string): Promise<AssignmentGrade | null> {
        // let returningPromise = new Promise((resolve, reject) => {
        //     let gradeObj : Grade = await this.gc.getGrade(org, personId, assignId);
        // });
        //
        // return returningPromise;
        Log.info("AssignmentController:getAssignmentGrade("+", "+personId+", "+assignId+") - start");
        let grade : Grade = await this.gc.getGrade(personId,assignId);
        if (grade === null) return null;

        const assignmentGrade : AssignmentGrade = grade.custom;
        return assignmentGrade;
    }

    public async setAssignmentGrade(repoID: string, assignId: string, assnPayload: AssignmentGrade) : Promise<boolean> {
        // Array<Array<SubsectionGrade>>
        Log.info("AssignmentController::setAssignmentGrade("+", "+repoID+", "+assignId+",..) - start");
        Log.trace("AssignmentController::setAssignmentGrade(..) - payload: " + JSON.stringify(assnPayload));

        let totalGrade = 0;

        for (const aQuestion of assnPayload.questions) {
            for (const aSubQuestion of aQuestion.subQuestion) {
                // Sum up all subcompartment grades
                totalGrade += aSubQuestion.grade;
            }
        }

        let newGradePayload : GradePayload = {
            // assignmentID: assnPayload.assignmentID,
            // studentID: assnPayload.studentID,
            score: totalGrade,
            comment: 'Marked assignment',
            URL: "", // TODO: Assign repo url
            timestamp: Date.now(),
            custom: assnPayload
        };

        let success = await this.gc.createGrade(repoID, assignId, newGradePayload);
        return success;
    }
}