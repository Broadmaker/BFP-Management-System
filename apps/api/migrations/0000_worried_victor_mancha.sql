CREATE TABLE `appointments` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`business` text,
	`type` text NOT NULL,
	`date` text NOT NULL,
	`time` text,
	`address` text,
	`status` text DEFAULT 'Pending' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `attendance` (
	`id` text PRIMARY KEY NOT NULL,
	`personnel_id` text NOT NULL,
	`date` text NOT NULL,
	`type` text NOT NULL,
	`time_in` text,
	`time_out` text,
	`remarks` text,
	FOREIGN KEY (`personnel_id`) REFERENCES `personnel`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`action` text NOT NULL,
	`module` text NOT NULL,
	`reference_id` text,
	`details` text,
	`ip_address` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `certificates` (
	`id` text PRIMARY KEY NOT NULL,
	`establishment_id` text NOT NULL,
	`certificate_number` text NOT NULL,
	`issued_date` text NOT NULL,
	`expiry_date` text NOT NULL,
	`status` text DEFAULT 'Active',
	`qr_code` text,
	`issued_by_id` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`establishment_id`) REFERENCES `establishments`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`issued_by_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `certificates_certificate_number_unique` ON `certificates` (`certificate_number`);--> statement-breakpoint
CREATE TABLE `community_programs` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`type` text NOT NULL,
	`description` text,
	`location` text,
	`barangay` text,
	`scheduled_date` text,
	`status` text DEFAULT 'Scheduled' NOT NULL,
	`conducted_by_id` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`conducted_by_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `dispatch_units` (
	`id` text PRIMARY KEY NOT NULL,
	`incident_id` text NOT NULL,
	`unit_name` text NOT NULL,
	`unit_type` text NOT NULL,
	`personnel_count` integer DEFAULT 0,
	`status` text DEFAULT 'En Route',
	`dispatched_at` text,
	`arrived_at` text,
	FOREIGN KEY (`incident_id`) REFERENCES `incidents`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `document_routes` (
	`id` text PRIMARY KEY NOT NULL,
	`document_id` text NOT NULL,
	`from_user_id` text,
	`to_user_id` text,
	`action` text,
	`remarks` text,
	`routed_at` text NOT NULL,
	FOREIGN KEY (`document_id`) REFERENCES `documents`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`from_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`to_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`type` text NOT NULL,
	`category` text,
	`description` text,
	`file_url` text,
	`status` text DEFAULT 'Draft' NOT NULL,
	`created_by_id` text,
	`approved_by_id` text,
	`version` integer DEFAULT 1,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`created_by_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`approved_by_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `equipment` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`serial_number` text,
	`status` text DEFAULT 'Operational' NOT NULL,
	`location` text,
	`assigned_to` text,
	`purchase_date` text,
	`last_maintenance_date` text,
	`next_maintenance_date` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`assigned_to`) REFERENCES `personnel`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `equipment_serial_number_unique` ON `equipment` (`serial_number`);--> statement-breakpoint
CREATE TABLE `establishments` (
	`id` text PRIMARY KEY NOT NULL,
	`business_name` text NOT NULL,
	`owner_name` text NOT NULL,
	`owner_contact` text,
	`address` text NOT NULL,
	`barangay` text NOT NULL,
	`occupancy_type` text NOT NULL,
	`classification` text,
	`compliance_status` text DEFAULT 'Pending' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `fuel_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`vehicle_id` text NOT NULL,
	`date` text NOT NULL,
	`liters` integer NOT NULL,
	`cost` integer,
	`mileage` integer,
	`remarks` text,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `hazard_reports` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`location` text NOT NULL,
	`barangay` text,
	`reporter` text,
	`date` text NOT NULL,
	`status` text DEFAULT 'New' NOT NULL,
	`priority` text DEFAULT 'Medium' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `hydrant_inspections` (
	`id` text PRIMARY KEY NOT NULL,
	`hydrant_id` text NOT NULL,
	`inspected_by_id` text,
	`inspected_date` text NOT NULL,
	`water_pressure` integer,
	`is_operational` integer DEFAULT true,
	`remarks` text,
	FOREIGN KEY (`hydrant_id`) REFERENCES `hydrants`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`inspected_by_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `hydrants` (
	`id` text PRIMARY KEY NOT NULL,
	`hydrant_id` text NOT NULL,
	`gps_latitude` text,
	`gps_longitude` text,
	`barangay` text NOT NULL,
	`street` text,
	`installation_date` text,
	`status` text DEFAULT 'Operational' NOT NULL,
	`ownership` text,
	`water_pressure` integer,
	`last_inspected_date` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `hydrants_hydrant_id_unique` ON `hydrants` (`hydrant_id`);--> statement-breakpoint
CREATE TABLE `incident_documents` (
	`id` text PRIMARY KEY NOT NULL,
	`incident_id` text NOT NULL,
	`type` text NOT NULL,
	`url` text,
	`description` text,
	`uploaded_at` text NOT NULL,
	`uploaded_by` text,
	FOREIGN KEY (`incident_id`) REFERENCES `incidents`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `incident_timeline` (
	`id` text PRIMARY KEY NOT NULL,
	`incident_id` text NOT NULL,
	`event` text NOT NULL,
	`timestamp` text NOT NULL,
	`created_by` text,
	FOREIGN KEY (`incident_id`) REFERENCES `incidents`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `incidents` (
	`id` text PRIMARY KEY NOT NULL,
	`incident_number` text NOT NULL,
	`type` text NOT NULL,
	`severity` text NOT NULL,
	`status` text DEFAULT 'New' NOT NULL,
	`location` text NOT NULL,
	`barangay` text NOT NULL,
	`occupancy_type` text,
	`description` text,
	`date_reported` text NOT NULL,
	`reporter_name` text,
	`reporter_contact` text,
	`reported_by_id` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`reported_by_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `incidents_incident_number_unique` ON `incidents` (`incident_number`);--> statement-breakpoint
CREATE TABLE `inspections` (
	`id` text PRIMARY KEY NOT NULL,
	`establishment_id` text NOT NULL,
	`inspector_id` text,
	`scheduled_date` text,
	`completed_date` text,
	`result` text,
	`notes` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`establishment_id`) REFERENCES `establishments`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`inspector_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `investigations` (
	`id` text PRIMARY KEY NOT NULL,
	`incident_id` text NOT NULL,
	`investigator_id` text,
	`cause_classification` text,
	`notes` text,
	`recommendations` text,
	`status` text DEFAULT 'Open',
	`opened_at` text,
	`closed_at` text,
	FOREIGN KEY (`incident_id`) REFERENCES `incidents`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`investigator_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `investigations_incident_id_unique` ON `investigations` (`incident_id`);--> statement-breakpoint
CREATE TABLE `leave_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`personnel_id` text NOT NULL,
	`type` text NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`reason` text,
	`status` text DEFAULT 'Pending' NOT NULL,
	`approved_by_id` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`personnel_id`) REFERENCES `personnel`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`approved_by_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `maintenance_records` (
	`id` text PRIMARY KEY NOT NULL,
	`asset_type` text NOT NULL,
	`asset_id` text NOT NULL,
	`type` text NOT NULL,
	`description` text,
	`performed_date` text NOT NULL,
	`performed_by_id` text,
	`cost` integer,
	`next_scheduled_date` text,
	FOREIGN KEY (`performed_by_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`message` text,
	`type` text DEFAULT 'info',
	`is_read` integer DEFAULT false,
	`module` text,
	`reference_id` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `personnel` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`employee_number` text NOT NULL,
	`rank` text,
	`position` text NOT NULL,
	`assignment` text,
	`contact_number` text,
	`date_hired` text,
	`is_active` integer DEFAULT true,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `personnel_employee_number_unique` ON `personnel` (`employee_number`);--> statement-breakpoint
CREATE TABLE `program_participants` (
	`id` text PRIMARY KEY NOT NULL,
	`program_id` text NOT NULL,
	`name` text NOT NULL,
	`contact_number` text,
	`email` text,
	`attended` integer DEFAULT false,
	`registered_at` text NOT NULL,
	FOREIGN KEY (`program_id`) REFERENCES `community_programs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `service_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`requester` text NOT NULL,
	`business` text,
	`contact` text,
	`date` text NOT NULL,
	`status` text DEFAULT 'Pending' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `shift_schedules` (
	`id` text PRIMARY KEY NOT NULL,
	`personnel_id` text NOT NULL,
	`shift_date` text NOT NULL,
	`shift_type` text NOT NULL,
	`start_time` text,
	`end_time` text,
	`notes` text,
	FOREIGN KEY (`personnel_id`) REFERENCES `personnel`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `trainings` (
	`id` text PRIMARY KEY NOT NULL,
	`personnel_id` text NOT NULL,
	`title` text NOT NULL,
	`provider` text,
	`completed_date` text,
	`expiry_date` text,
	`certificate_url` text,
	FOREIGN KEY (`personnel_id`) REFERENCES `personnel`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`password_hash` text NOT NULL,
	`role` text DEFAULT 'Fire Officer' NOT NULL,
	`rank` text,
	`position` text,
	`contact_number` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `vehicles` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`plate_number` text NOT NULL,
	`type` text NOT NULL,
	`status` text DEFAULT 'Available' NOT NULL,
	`assigned_crew` text,
	`mileage` integer DEFAULT 0,
	`last_maintenance_date` text,
	`next_maintenance_date` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `vehicles_plate_number_unique` ON `vehicles` (`plate_number`);--> statement-breakpoint
CREATE TABLE `violations` (
	`id` text PRIMARY KEY NOT NULL,
	`establishment_id` text NOT NULL,
	`description` text NOT NULL,
	`notice_date` text NOT NULL,
	`compliance_deadline` text,
	`status` text DEFAULT 'Open',
	`corrective_actions` text,
	`resolved_at` text,
	FOREIGN KEY (`establishment_id`) REFERENCES `establishments`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `volunteers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`contact_number` text,
	`email` text,
	`barangay` text,
	`skills` text,
	`training_completed` integer DEFAULT false,
	`is_active` integer DEFAULT true,
	`registered_at` text NOT NULL
);
