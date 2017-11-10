/* View Jtis that are already expired */
SELECT * FROM public."Jtis"
WHERE "ExpiryTime" < (now() + INTERVAL '15 minutes')
ORDER BY "Id" ASC

/* Delete Jtis that are already expired */
DELETE FROM public."Jtis"
WHERE "ExpiryTime" < (now() + INTERVAL '15 minutes')

/* Set email confirmation to True */
UPDATE public."AspNetUsers"
SET "EmailConfirmed" = true
WHERE "Email" = 'newtest@test.com'

/* Delete accounts where email has not been confirmed" */
DELETE FROM public."AspNetUsers"
WHERE "EmailConfirmed" = false