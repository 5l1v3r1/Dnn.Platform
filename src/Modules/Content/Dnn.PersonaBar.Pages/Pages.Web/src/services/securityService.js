import utils from "../utils";

const securityService = {
    userHasPermission(permission) {
        const isSuperUser = utils.getIsSuperUser();        
        if (isSuperUser) {
            return true;
        }
        
        if (!permission) {
            return true;
        }
        
        const userPermissionsOverPage = utils.getCurrentPagePermissions();
        
        return userPermissionsOverPage[permission];
    },
    isSuperUser() {
        return utils.getIsSuperUser();
    }
};
export default securityService;