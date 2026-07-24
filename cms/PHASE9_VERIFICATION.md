# Phase 9 update and recovery verification

Phase 9 has two separate test suites. Keeping them separate makes the normal
update/recovery test repeatable and prevents an intentional uninstall from
breaking later test runs.

## Before either suite

1. Use staging or a disposable WordPress copy, never production.
2. Create a complete hosting files-and-database backup.
3. Install and activate the current Superior Plus theme and content plugin.
4. Run the approved-content importer and confirm its report is complete.
5. Build the current packages:

   ```powershell
   powershell -ExecutionPolicy Bypass -File scripts/package-wordpress-theme.ps1
   powershell -ExecutionPolicy Bypass -File scripts/package-wordpress-plugin.ps1
   ```

## Repeatable core suite

Point the test at staging and run:

```powershell
$env:SPP_PHASE9_WP_URL='https://staging.example.com'
$env:SPP_WP_USER='phase9-test-admin'
$env:SPP_WP_PASSWORD='use-a-temporary-staging-password'
npm run qa:phase9
```

Use a temporary staging administrator created for the test and remove it when
verification is complete. Accounts protected by an interactive two-factor
challenge require the equivalent steps to be performed manually.

The suite verifies:

- authenticated JSON export and guarded re-import;
- creation, publication, React rendering, editing and unpublishing of a
  temporary locked Standard Page;
- cleanup of the temporary page;
- content survival through theme and plugin package replacement;
- content survival while switching to another theme and back;
- restoration of the complete managed-content fingerprint.

The result is written to
`wordpress-plugin/dist/phase9/lifecycle-report.json`.

## Destructive uninstall suite

Run this only on a fresh disposable WordPress runtime:

```powershell
$env:SPP_PHASE9_WP_URL='https://disposable.example.com'
$env:SPP_WP_USER='admin'
$env:SPP_WP_PASSWORD='disposable-test-password'
npm run qa:phase9:uninstall
```

This suite deactivates and deletes the plugin files, then verifies that all
managed pages, services and projects remain in the WordPress database. The
runtime must be discarded or the plugin must be reinstalled manually
afterward. Do not rerun this suite against the same WordPress Playground
instance because its virtual filesystem can retain an invisible deleted-plugin
directory.

## Host backup rehearsal

The automated suites do not replace a hosting-provider restore:

1. Record the staging backup timestamp.
2. Make a harmless, visible staging-only content change.
3. Restore both files and database from the same timestamp.
4. Clear WordPress, host and CDN caches.
5. Confirm the visible change is gone and all 15 approved routes work.
6. Record the restore timestamp and result.

Phase 9 is fully cleared only after the core report passes, the disposable
uninstall test passes, and the hosting restore rehearsal is recorded.
