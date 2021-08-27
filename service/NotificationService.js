import gcm from 'node-gcm';
import { SECRET_KEYS } from '../src/Config';

const MOBILE_PLATFORM = "ANDROID" | "IOS";

var AndroidMessage = {
    collapseKey: 'demo',
	priority: 'high',
	contentAvailable: true,
	delayWhileIdle: true,
	timeToLive: 3,
	restrictedPackageName: "somePackageName",
	dryRun: true,
	data: {
		key1: 'message1',
		key2: 'message2'
	},
	notification: {
		title: "Hello, World",
		icon: "ic_launcher",
		body: "This is a notification that will be displayed if your app is in the background."
	}
}

// Specify which registration IDs to deliver the message to
const REGS_TOKEN = ['YOUR_REG_TOKEN_HERE'];
/*
This library provides the server-side implementation of FCM.
You need to generate an API Key (Click the gear next to FCM project name) 
> Project Settings > Cloud Messaging -> Server Key).
*/
var Sender = new gcm.Sender(SECRET_KEYS.API_KEY_ANDROID);

/**
 * @description ANDROID
 */
function AndroidPlatform() {
    
}

/**
 * @description APPLE
 */
function AppleIOSPlatform() {

}