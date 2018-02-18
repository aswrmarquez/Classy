import * as rp from "request-promise-native";
import Log from "../util/Log";

export interface IClassPortal {

    /**
     * For a given commitUrl, figure out what the default deliverable is at the current time.
     *
     * NOTE: commitUrl could be something simpler too, maybe just courseId is easiest:
     *
     * GET /admin/getDefaultDeliverable/{:courseId}
     *
     * @param courseId
     */
    getDefaultDeliverableId(courseId: string): Promise<string | null>;

    /**
     * Returns whether the username is staff on the course.
     *
     * GET /admin/isStaff/{:courseId}/{:userId} (or some variant)
     *
     * @param courseId
     * @param userName
     */
    isStaff(courseId: string, userName: string): Promise<boolean>;

    /**
     * Gets the identifier for the AutoTest docker container that should process requests for this deliverable.
     *
     * GET /admin/{:courseId}/{:delivId}/container
     *
     * @param courseId
     */
    getContainerDetails(courseId: string, delivId: string): Promise<{ dockerImage: string, dockerBuild: string, testDelay: number, regressionDelivNames: string[] } | null>;
}

export class ClassPortal implements IClassPortal {

    public async isStaff(courseId: string, userName: string): Promise<boolean> {
        if (typeof courseId === "undefined" || courseId === null || typeof userName === "undefined" || userName === null) {
            Log.error("ClassPortal::isStaff(..) - missing parameters");
            return false;
        }

        const url = "https://portal.cs.ubc.ca:5000/" + courseId + "/isStaff/" + userName;
        return rp(url).then(function (res) {
            Log.trace("ClassPortal::isStaff( " + courseId + ", " + userName + " ) - success; payload: " + res);
            const json = JSON.parse(res);
            return json.response;
        }).catch(function (err) {
            Log.trace("ClassPortal::isStaff(..) - ERROR; url: " + url + "; ERROR: " + err);
            return false; // err on the side of caution
        });
    }

    public async getDefaultDeliverableId(courseId: string): Promise<string | null> {
        if (typeof courseId === "undefined" || courseId === null) {
            Log.error("ClassPortal::getDefaultDeliverableId(..) - missing parameters");
            return null;
        }

        const url = "https://portal.cs.ubc.ca:5000/" + courseId + "/defaultDeliverable";
        return rp(url).then(function (res) {
            Log.trace("ClassPortal::getDefaultDeliverableId( " + courseId + " ) - success; payload: " + res);
            const json = JSON.parse(res);
            return json.response;
        }).catch(function (err) {
            Log.trace("ClassPortal::getDefaultDeliverableId(..) - ERROR; url: " + url + "; ERROR: " + err);
            return null;
        });
    }

    /**
     * Gets the delay beween test executions in milliseconds
     *
     * @param {string} courseId
     * @returns {Promise<number>}
     */

    /*
    public async getTestDelay(courseId: string, delivId: string): Promise<number | null> {
        if (typeof courseId === "undefined" || courseId === null || typeof delivId === "undefined" || delivId === null) {
            Log.error("ClassPortal::getTestDelay(..) - missing parameters");
            return null;
        }

        const url = "https://portal.cs.ubc.ca:5000/" + courseId + "/" + delivId + "/rate";
        return rp(url).then(function (res) {
            Log.trace("ClassPortal::getTestDelay( " + courseId + ", " + delivId + " ) - success; payload: " + res);
            const json = JSON.parse(res);
            return json.response;
        }).catch(function (err) {
            Log.trace("ClassPortal::getTestDelay(..) - ERROR; url: " + url + "; ERROR: " + err);
            return null;
        });
    }
*/
    public async getContainerDetails(courseId: string, delivId: string): Promise<{ dockerImage: string, dockerBuild: string, testDelay: number, regressionDelivNames: string[] } | null> {
        if (typeof courseId === "undefined" || courseId === null || typeof delivId === "undefined" || delivId === null) {
            Log.error("ClassPortal::getContainerId(..) - missing parameters");
            return null;
        }

        const url = "https://portal.cs.ubc.ca:5000/" + courseId + "/" + delivId + "/container";
        return rp(url).then(function (res) {
            Log.trace("ClassPortal::getContainerId( " + courseId + ", " + delivId + " ) - success; payload: " + res);
            const json = JSON.parse(res);
            return json.response;
        }).catch(function (err) {
            Log.trace("ClassPortal::getContainerId(..) - ERROR; url: " + url + "; ERROR: " + err);
            return null;
        });
    }

}
