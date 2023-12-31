CREATE OR REPLACE TRIGGER deleteRunning
AFTER INSERT ON TRIP_HISTORY
FOR EACH ROW
BEGIN
    DELETE from RUNNING_TRIP WHERE TR_ID=:new.TR_ID;
END;
/






CREATE OR REPLACE TRIGGER making_payment
AFTER INSERT ON TRIP_HISTORY
FOR EACH ROW
BEGIN
    
		MAKE_TRANSACTION(:new.USERNAME,:new.PLATE_NO,:new.fare);
END;
/



CREATE OR REPLACE TRIGGER paymentTableInsert
AFTER INSERT ON TRIP_HISTORY
FOR EACH ROW
BEGIN
    INSERT into PAYMENTS(TR_ID,AMOUNT,TRANSACTION_NO)
VALUES(:new.TR_ID,:new.FARE,generate_transaction_no());
		
END;
/











